import 'weather-icons/css/weather-icons.css';

import localFont from 'next/font/local'
import { OpenWeatherConditionCodes } from './OpenWeatherDTO';

const myFont = localFont({ src: '../../../node_modules/weather-icons/font/weathericons-regular-webfont.woff' })

interface WeatherConditionProps {
    time: string;
    code: OpenWeatherConditionCodes;
    className?: string;
}

export const WeatherCondition = ({time, code, className}: WeatherConditionProps) => {
    const icon = `wi wi-owm-${code}`;
    // const icon = `wi wi-owm-night|day-${code}`;
    return <i className={icon + " text-5xl " + className} />;
}

export default WeatherCondition;
