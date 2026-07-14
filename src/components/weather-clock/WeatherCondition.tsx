import { OpenWeatherConditionCodes } from './OpenWeatherDTO';

interface WeatherConditionProps {
    time: string;
    code: OpenWeatherConditionCodes;
    icon?: string;
    className?: string;
}

export const WeatherCondition = ({code, icon, className}: WeatherConditionProps) => {
    const iconUrl = icon
        ? `https://openweathermap.org/img/wn/${icon}@2x.png`
        : `https://openweathermap.org/img/wn/01d@2x.png`;

    return (
        <img
            src={iconUrl}
            alt={`Weather condition ${code}`}
            width={48}
            height={48}
            className={className}
        />
    );
}

export default WeatherCondition;
    