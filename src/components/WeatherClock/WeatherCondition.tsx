import 'weather-icons/css/weather-icons.css';

import { createDebugger } from '@/lib/debug';
import localFont from 'next/font/local';
import ResponsiveTypography from '../ui/typography';
import { OpenWeatherConditionCodes } from './providers/OpenWeatherDTO';

const myFont = localFont({ src: '../../../node_modules/weather-icons/font/weathericons-regular-webfont.woff' })

const debug = createDebugger('weather:condition')

interface WeatherConditionProps {
    time: string;
    code: OpenWeatherConditionCodes;
    className?: string;
}

export const WeatherCondition = ({time, code, className}: WeatherConditionProps) => {
    const icon = `wi wi-owm-${code}`;
    // const icon = `wi wi-owm-night|day-${code}`;
    return <ResponsiveTypography tag="i" size="3xl" className={icon + " " + className} />;
}

export default WeatherCondition;
    