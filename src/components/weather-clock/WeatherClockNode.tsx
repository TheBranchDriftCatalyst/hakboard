//  This is going to hold the data node for the weather at that hour.
// - Each node represents the weather at that hour.
// - The node will contain the temperature, the weather condition, or the time.  We will rotate through the different metrics.

import { Droplets, Gauge, HelpCircle, LucideIcon, Radiation } from "lucide-react";
import {
  CloudHail,
  Sunrise,
  Sunset,
  Haze,
  Tornado,
  SunMoon,
  CloudSun,
  CloudFog,
  Snowflake,
  CloudLightning,
  Cloud,
  Cloudy,
  Wind,
  Thermometer,
  CloudRainWind,
  AlarmSmoke,
  CloudDrizzle,
  LucideIcon as LucidIcon,
} from "lucide-react";
import React, { useMemo } from "react";
import {
  OpenWeatherIconMapping,
  WeatherConditionIFace,
  WeatherDatumIFace,
} from "./OpenWeatherDTO";
import Debug from "debug";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DateTime } from "luxon";
import ResponsiveTypography from "../ui/typography";
import WeatherCondition from "./WeatherCondition";
import localFont from 'next/font/local'

import 'weather-icons/css/weather-icons.css';

interface ClockNodeStyleProps extends React.CSSProperties {
  x: number;
  y: number;
  angle?: number;
}

const unknownWeatherCondition:
  | WeatherConditionIFace
  | { id: 9999; description: string } = {
  id: 9999,
  description: "unknown condition",
};

interface WeatherClockNodeInterface {
  weatherData: WeatherDatumIFace;
  style?: ClockNodeStyleProps;
}

export interface WeatherDatumConfig {
    icon: string;
    formatter: (value: any) => string;
}

export const WeatherMetric: Partial<Record<keyof WeatherDatumIFace, JSX.Element | WeatherDatumConfig>> = {
    sunrise: <Sunrise />,
    sunset: <Sunset />,
    temp: <Thermometer />,
    // feels_like: 'Feels Like',
    pressure: <Gauge />,
    humidity: <Droplets />,
    // dew_point: 'Dew Point',
    uvi: <Radiation />,
    clouds: <Cloud />,
    // visibility: <Telescope />,
    wind_speed: <Wind />,
    // wind_deg: 'Wind Direction',
    wind_gust: <Wind />,
    // rain: 'Rain',
    // snow: 'Snow',
}

//  both getters and formatters in one, no need to separate this yet
export const WeatherMetricFormatters: Partial<Record<keyof WeatherDatumIFace, (weatherData: WeatherDatumIFace, currentMetric: keyof WeatherDatumIFace) => string>> = {
    temp: (weatherData, currentMetric) => `${weatherData[currentMetric]}&deg;F`,
    uvi: (weatherData, currentMetric) => `${weatherData[currentMetric]}`,
    wind_speed: (weatherData, currentMetric) => `${weatherData[currentMetric]} mph`,
    wind_gust: (weatherData, currentMetric) => `${weatherData[currentMetric]} mph`,
    pressure: (weatherData, currentMetric) => `${weatherData[currentMetric]} hPa`,
    humidity: (weatherData, currentMetric) => `${weatherData[currentMetric]}%`,
    clouds: (weatherData, currentMetric) => `${weatherData[currentMetric]}%`,
    sunrise: (weatherData, currentMetric) => DateTime.fromSeconds(weatherData['sunrise']).toLocaleString(DateTime.TIME_SIMPLE),
    sunset: (weatherData, currentMetric) => DateTime.fromSeconds(weatherData['sunset']).toLocaleString(DateTime.TIME_SIMPLE),
}

interface WeatherDatumProps {
    weatherData: WeatherDatumIFace;
    currentMetric: keyof WeatherDatumIFace;
}

export const WeatherDatum = ({weatherData, currentMetric}: WeatherDatumProps) => {

    const formatter = WeatherMetricFormatters[currentMetric] || ((weatherData: WeatherConditionIFace) => weatherData[currentMetric]);

    return (
        <div className="flex flex-col items-center">
            <ResponsiveTypography tag="span" size="2xs" className="text-secondary">
              {formatter(weatherData, currentMetric)}
            </ResponsiveTypography>
        </div>
    )
}

    

export const WeatherClockNode = (props: any) => {
  const debug = Debug(`weather:clock:node:${props.hour12}`);
  const { weatherData, style, hour12, currentMetric } = props;
  const { counterRotationStyles, angle } = props.rotation;
  const { weather } = weatherData || { weather: [unknownWeatherCondition] };
  const [{ id: primaryConditionID, description: primaryDescription }] = weather;
  // const ConditionIcon = WeatherConditionCodes[primaryConditionID] as LucideIcon;
  const currentHour24 = new Date().getHours();

  const isNow = currentHour24 % 12 == hour12;

  if (primaryConditionID === 9999) {
    console.warn(`No condition icon for code ${primaryConditionID}`, {
      weatherData,
    });
  }

  debug("WeatherClockNode", {
    ...props,
    dt: weatherData?.dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
  });

  return (
    <div style={style} className="no-drag">
      <HoverCard>
        <HoverCardTrigger>
          <div className={`w-12 h-12`} style={{ position: "relative" }}>
            <div
              className={`w-full h-full p-0 m-0 flex justify-center items-center`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%)`,
              }}
            >
              <div
                style={{ ...counterRotationStyles }}
                className="p-0 text-primary"
              >
                <WeatherDatum weatherData={weatherData} currentMetric={currentMetric} />
              </div>
              <div
                style={{ ...counterRotationStyles }}
                className="w-full h-full flex justify-center items-center"
              >
                <WeatherCondition 
                  code={primaryConditionID}
                  className={`${isNow ? "text-primary animate-pulse" : ""}`} 
                  time={""}
                />
              </div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent style={{ ...counterRotationStyles }}>
          <div>
            <span>
              {weatherData?.dt &&
                weatherData.dt.toLocaleString(
                  DateTime.DATETIME_FULL_WITH_SECONDS
                )}
            </span>
            <span>{JSON.stringify(weatherData, null, 2)}</span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default React.memo(WeatherClockNode);
