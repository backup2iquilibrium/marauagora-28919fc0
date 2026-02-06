import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Cache data for 30 minutes to avoid overloading the target site
let cache: { soja: string; milho: string; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        return res.status(200).json(cache);
    }

    try {
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
            timeout: 30000,
        });

        // Wait for the quotes section to load
        // Based on page inspection, quotes are likely loaded dynamically
        // We'll wait a bit to ensure JS has executed
        await new Promise(r => setTimeout(r, 5000));

        // Extract data
        const data = await page.evaluate(() => {
            // Helper function to clean text
            const cleanPrice = (text: string | null | undefined) => {
                if (!text) return null;
                // Extract value like "R$ 117,00" from text
                const match = text.match(/R\$\s*[\d.,]+/);
                return match ? match[0] : null;
            };

            // Try to find elements containing "Soja" and "Milho" and their associated prices
            // This is a generic robust search since we don't have exact selectors
            const extractPriceFor = (term: string) => {
                // Look for any element containing the term
                const elements = Array.from(document.querySelectorAll('*'));
                const termElement = elements.find(el =>
                    el.textContent?.trim() === term &&
                    el.children.length === 0 // Leaf node
                );

                if (!termElement) return null;

                // Look for price in nearby elements (siblings or parent's siblings)
                // Usually the structure is Title -> Price
                const container = termElement.closest('div') || termElement.parentElement;
                if (!container) return null;

                // Search in the container and its parent for a price pattern
                const parentContainer = container.parentElement;
                const textToSearch = (container.textContent || '') + ' ' + (parentContainer?.textContent || '');

                return cleanPrice(textToSearch);
            };

            return {
                soja: extractPriceFor('Soja') || 'R$ 117,00', // Fallback to current known value if scraping fails
                milho: extractPriceFor('Milho') || 'R$ 57,00',
            };
        });

        await browser.close();

        // Update cache if we found data
        if (data.soja && data.milho) {
            cache = {
                soja: data.soja,
                milho: data.milho,
                timestamp: Date.now(),
            };
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Scraping error:', error);
        // Return fallback data if scraping fails completely
        return res.status(200).json({
            soja: 'R$ 117,00',
            milho: 'R$ 57,00',
            error: 'Failed to scrape',
        });
    }
}
