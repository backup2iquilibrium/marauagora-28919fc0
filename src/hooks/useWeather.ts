import { useEffect, useState } from 'react';
import { getCompleteWeatherData, type WeatherData } from '@/services/weatherService';

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchWeather() {
            try {
                setLoading(true);
                const data = await getCompleteWeatherData();
                if (mounted) {
                    setWeather(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch weather');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchWeather();

        // Refresh weather data every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return { weather, loading, error };
}
