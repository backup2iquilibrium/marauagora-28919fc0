import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache data for 30 minutes to avoid overloading the target site
let cache: { soja: string; milho: string; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Check in-memory cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        return res.status(200).json(cache);
    }

    try {
        console.log('Starting scrape...');

        // Launch headless browser
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        // Navigate to Sementes Roos homepage
        await page.goto('https://sementesroos.com.br/', {
            waitUntil: 'networkidle2',
            timeout: 60000, // Increased timeout
        });

        // Wait to ensure JS has executed
        await new Promise(r => setTimeout(r, 5000));

        // Extract data
        const data = await page.evaluate(() => {
            const cleanPrice = (text: string | null | undefined) => {
                if (!text) return null;
                const match = text.match(/R\$\s*[\d.,]+/);
                return match ? match[0] : null;
            };

            const extractPriceFor = (term: string) => {
                const elements = Array.from(document.querySelectorAll('*'));
                const termElement = elements.find(el =>
                    el.textContent?.trim() === term &&
                    el.children.length === 0
                );

                if (!termElement) return null;

                const container = termElement.closest('div') || termElement.parentElement;
                if (!container) return null;

                const parentContainer = container.parentElement;
                const textToSearch = (container.textContent || '') + ' ' + (parentContainer?.textContent || '');

                return cleanPrice(textToSearch);
            };

            return {
                soja: extractPriceFor('Soja'),
                milho: extractPriceFor('Milho'),
            };
        });

        await browser.close();

        console.log('Scrape result:', data);

        let finalData = {
            soja: data.soja,
            milho: data.milho,
            source: 'scraper'
        };

        // If scraping failed or returned empty/invalid data (e.g. "Mercado fechado" which result in null from cleanPrice)
        // OR if we explicitly detect "Mercado fechado" text (though cleanPrice might return null for that)
        // We check if we have data. 
        // Note: cleanPrice returns null if it doesn't find R$ ...

        if (!finalData.soja || !finalData.milho) {
            console.log('Scraping returned partial/no data, checking Supabase for fallback...');
            const { data: lastQuote, error } = await supabase
                .from('quotes')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (lastQuote) {
                console.log('Using fallback data from Supabase');
                finalData = {
                    soja: finalData.soja || lastQuote.soja,
                    milho: finalData.milho || lastQuote.milho,
                    source: 'database_fallback'
                };
            } else {
                console.log('No fallback data in Supabase');
            }
        } else {
            // We have valid data, save to Supabase
            console.log('Saving valid data to Supabase...');
            const { error: insertError } = await supabase
                .from('quotes')
                .insert([
                    {
                        soja: finalData.soja,
                        milho: finalData.milho,
                        source: 'scraper'
                    }
                ]);

            if (insertError) {
                console.error('Error saving to Supabase:', insertError);
            }
        }

        // Final fallback if everything failed
        if (!finalData.soja) finalData.soja = 'R$ 117,00';
        if (!finalData.milho) finalData.milho = 'R$ 57,00';

        // Update cache
        cache = {
            soja: finalData.soja!,
            milho: finalData.milho!,
            timestamp: Date.now(),
        };

        return res.status(200).json(finalData);
    } catch (error: any) {
        console.error('Scraping error:', error);

        // Try to fetch from Supabase on error
        const { data: lastQuote } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (lastQuote) {
            return res.status(200).json({
                soja: lastQuote.soja,
                milho: lastQuote.milho,
                source: 'database_error_fallback',
                error: error.message
            });
        }

        return res.status(200).json({
            soja: 'R$ 117,00',
            milho: 'R$ 57,00',
            source: 'hardcoded_fallback',
            error: error.message || 'Failed to scrape'
        });
    }
}
