// Financial quotes data types
import { supabase } from "@/integrations/supabase/client";

export interface QuoteData {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
}

export interface QuotesResponse {
    quotes: QuoteData[];
    lastUpdated: Date;
}

/**
 * Fetches USD/BRL exchange rate from AwesomeAPI (Brazil)
 */
async function getUSDRate(): Promise<QuoteData> {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        if (!response.ok) throw new Error(`USD API error: ${response.status}`);

        const data = await response.json();
        const rate = parseFloat(data.USDBRL.bid);

        return {
            label: 'USD',
            value: `R$ ${rate.toFixed(2).replace('.', ',')}`,
        };
    } catch (error) {
        console.error('Error fetching USD rate:', error);
        return { label: 'USD', value: 'R$ 5,01' }; // Fallback
    }
}

/**
 * Fetches Bitcoin price in BRL from CoinGecko
 */
async function getBitcoinPrice(): Promise<QuoteData> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        if (!response.ok) throw new Error(`Bitcoin API error: ${response.status}`);

        const data = await response.json();
        const price = data.bitcoin.brl;

        // Format large numbers with K for thousands
        const formatted = price >= 1000
            ? `R$ ${(price / 1000).toFixed(0)}k`
            : `R$ ${price.toFixed(2).replace('.', ',')}`;

        return {
            label: 'Bitcoin',
            value: formatted,
        };
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return { label: 'Bitcoin', value: 'R$ 350k' }; // Fallback
    }
}

/**
 * Gets commodity prices from Sementes Roos via serverless API
 */
// Gets commodity prices from Sementes Roos via Supabase or serverless API
async function getCommodityPrices(): Promise<QuoteData[]> {
    try {
        // 1. Try to get latest from Supabase first
        const { data: lastQuote, error } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // Check if data is fresh (e.g., < 4 hours old) or if it's weekend
        // For now, if we have ANY data, we prefer it over "Mercado fechado"
        const isFresh = lastQuote && (new Date().getTime() - new Date(lastQuote.created_at).getTime() < 4 * 60 * 60 * 1000);

        // Logical flow:
        // If we have data in Supabase, use it immediately to render something.
        // If it's stale and we are in a browser environment (not build), we can optionally trigger an update in the background.
        // But since /api/quotes triggers the update, we can just call it if data is missing or stale.
        // HOWEVER, calling /api/quotes locally (npm run dev) might fail if not proxied.

        if (lastQuote) {
            // Return Supabase data
            return [
                { label: 'Soja', value: lastQuote.soja || 'R$ 117,00' },
                { label: 'Milho', value: lastQuote.milho || 'R$ 57,00' },
            ];
        }

        // 2. If no data in Supabase, try the API (which will scrape and save to Supabase)
        const response = await fetch('/api/quotes');
        if (!response.ok) throw new Error('Failed to fetch commodity quotes from API');

        const data = await response.json();

        return [
            { label: 'Soja', value: data.soja || 'R$ 117,00' },
            { label: 'Milho', value: data.milho || 'R$ 57,00' },
        ];
    } catch (error) {
        console.error('Error fetching commodity prices:', error);

        // 3. Fallback to hardcoded values
        return [
            { label: 'Soja', value: 'R$ 117,00' },
            { label: 'Milho', value: 'R$ 57,00' },
        ];
    }
}

/**
 * Fetches all financial quotes
 */
export async function getAllQuotes(): Promise<QuotesResponse> {
    try {
        const [usd, bitcoin, commodities] = await Promise.all([
            getUSDRate(),
            getBitcoinPrice(),
            getCommodityPrices(),
        ]);

        return {
            quotes: [usd, bitcoin, ...commodities],
            lastUpdated: new Date(),
        };
    } catch (error) {
        console.error('Error fetching all quotes:', error);
        // Return safe fallback
        return {
            quotes: [
                { label: 'USD', value: 'R$ 5,01' },
                { label: 'Bitcoin', value: 'R$ 350k' },
                { label: 'Soja', value: 'R$ 117,00' },
                { label: 'Milho', value: 'R$ 57,00' },
            ],
            lastUpdated: new Date(),
        };
    }
}
