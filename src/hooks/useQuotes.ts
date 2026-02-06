import { useEffect, useState } from 'react';
import { getAllQuotes, type QuotesResponse } from '@/services/quotesService';

export function useQuotes() {
    const [quotes, setQuotes] = useState<QuotesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchQuotes() {
            try {
                setLoading(true);
                const data = await getAllQuotes();
                if (mounted) {
                    setQuotes(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchQuotes();

        // Refresh quotes every 5 minutes
        const interval = setInterval(fetchQuotes, 5 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return { quotes, loading, error };
}
