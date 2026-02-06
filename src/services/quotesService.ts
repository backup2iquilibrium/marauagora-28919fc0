// Financial quotes data types
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
 * Gets commodity prices (static for now, can be enhanced with Cotriel scraping)
 */
function getCommodityPrices(): QuoteData[] {
    return [
        { label: 'Soja', value: 'R$ 135,00' },
        { label: 'Milho', value: 'R$ 55,20' },
    ];
}

/**
 * Fetches all financial quotes
 */
export async function getAllQuotes(): Promise<QuotesResponse> {
    try {
        const [usd, bitcoin] = await Promise.all([
            getUSDRate(),
            getBitcoinPrice(),
        ]);

        const commodities = getCommodityPrices();

        return {
            quotes: [usd, bitcoin, ...commodities],
            lastUpdated: new Date(),
        };
    } catch (error) {
        console.error('Error fetching quotes:', error);
        // Return all fallback data
        return {
            quotes: [
                { label: 'USD', value: 'R$ 5,01' },
                { label: 'Bitcoin', value: 'R$ 350k' },
                { label: 'Soja', value: 'R$ 135,00' },
                { label: 'Milho', value: 'R$ 55,20' },
            ],
            lastUpdated: new Date(),
        };
    }
}
