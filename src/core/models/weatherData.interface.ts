import { weather } from './weather.interface';

export interface WeatherData {
    base: string;
    clouds: {
        all: number,
    };
    cod: number;
    coord: {
        lon: number,
        lat: number
    };
    dt: number;
    id: number;
    main: {
        temp: number | string,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number | string,
        humidity: number | string
    };
    name: string;
    rain?: {
        '1h': number | string
    }
    snow?: {
        '1h': number | string
    };
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    };
    timezone: number;
    visibility: number | string;
    weather: weather;
    wind: {
        speed: number | string,
        deg: number,
    }
}