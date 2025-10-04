import { OpenWeatherConditionCodes } from './OpenWeatherDTO';
import Image from 'next/image';

interface WeatherConditionProps {
    time: string;
    code: OpenWeatherConditionCodes;
    icon?: string;
    className?: string;
}

export const WeatherCondition = ({time, code, icon, className}: WeatherConditionProps) => {
    // Use OpenWeatherMap's built-in icon API
    // Icon codes are provided by the API (e.g., "01d", "02n", etc.)
    const iconUrl = icon
        ? `https://openweathermap.org/img/wn/${icon}@2x.png`
        : `https://openweathermap.org/img/wn/01d@2x.png`; // fallback

    return (
        <Image
            src={iconUrl}
            alt={`Weather condition ${code}`}
            width={48}
            height={48}
            className={className}
        />
    );
}

export default WeatherCondition;
    