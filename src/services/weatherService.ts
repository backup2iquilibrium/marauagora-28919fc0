// Weather data types
export interface WeatherData {
    current: {
        temp: number;
        feelsLike: number;
        humidity: number;
        windSpeed: number;
        description: string;
    };
    forecast: Array<{
        date: Date;
        temp: number;
        description: string;
    }>;
    location: string;
    lastUpdated: Date;
}

// Marau, RS coordinates
const MARAU_LAT = -28.45;
const MARAU_LON = -52.2;
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Fetches current weather data for Marau, RS from OpenWeatherMap API
 */
export async function getCurrentWeather(): Promise<WeatherData['current']> {
    if (!API_KEY) {
        console.error('VITE_OPENWEATHER_API_KEY is not defined. Please add it to your environment variables.');
        throw new Error('Weather API key is missing');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MARAU_LAT}&lon=${MARAU_LON}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Weather API error: ${response.status} - ${response.statusText}`);
        throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
    };
}

/**
 * Fetches 5-day weather forecast for Marau, RS from OpenWeatherMap API
 */
export async function getWeatherForecast(): Promise<WeatherData['forecast']> {
    if (!API_KEY) {
        console.error('VITE_OPENWEATHER_API_KEY is not defined. Please add it to your environment variables.');
        throw new Error('Weather API key is missing');
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${MARAU_LAT}&lon=${MARAU_LON}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Forecast API error: ${response.status} - ${response.statusText}`);
        throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();

    // Get daily forecast (one entry per day at noon)
    const dailyForecasts = data.list.filter((_: any, index: number) => index % 8 === 4);

    return dailyForecasts.slice(0, 4).map((item: any) => ({
        date: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
    }));
}

/**
 * Fetches complete weather data (current + forecast) for Marau, RS
 */
export async function getCompleteWeatherData(): Promise<WeatherData> {
    try {
        const [current, forecast] = await Promise.all([
            getCurrentWeather(),
            getWeatherForecast(),
        ]);

        return {
            current,
            forecast,
            location: 'Marau, RS',
            lastUpdated: new Date(),
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return fallback static data
        return {
            current: {
                temp: 24,
                feelsLike: 26,
                humidity: 62,
                windSpeed: 12,
                description: 'Parcialmente nublado',
            },
            forecast: [
                { date: new Date(), temp: 22, description: 'Nublado' },
                { date: new Date(), temp: 19, description: 'Chuva' },
                { date: new Date(), temp: 25, description: 'Ensolarado' },
                { date: new Date(), temp: 27, description: 'Ensolarado' },
            ],
            location: 'Marau, RS',
            lastUpdated: new Date(),
        };
    }
}
