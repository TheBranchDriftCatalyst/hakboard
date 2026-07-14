import {
  CloudHail, Sunrise, Sunset, Haze, Tornado, SunMoon, CloudSun, CloudFog, Snowflake, CloudLightning, Cloud, Cloudy,
  Wind, Thermometer, CloudRainWind, AlarmSmoke, CloudDrizzle, LucideIcon
} from "lucide-react";

export type OpenWeatherConditionCodes = 200 | 201 | 202 | 210 | 211 | 212 | 221 | 230 | 231 | 232 | 300 | 301 | 302 | 310 | 311 | 312 | 313 | 314 | 321 | 500 | 501 | 502 | 503 | 504 | 511 | 520 | 521 | 522 | 531 | 600 | 601 | 602 | 611 | 612 | 615 | 616 | 620 | 621 | 622 | 701 | 711 | 721 | 731 | 741 | 751 | 761 | 762 | 771 | 781 | 800 | 801 | 802 | 803 | 804;

export type OpenWeatherIconMapping = Record<OpenWeatherConditionCodes | 9999, [LucideIcon, LucideIcon] | LucideIcon>;

export interface HourlyPrecipitationIFace {
  "1h": number;
}

export interface WeatherConditionIFace {
  id: OpenWeatherConditionCodes;
  main: string;
  description: string;
  icon: string;
}

export type OpenWeatherDataMetric = 'temp' | 'feels_like' | 'pressure' | 'humidity' | 'dew_point' | 'uvi' | 'clouds' |
  'visibility' | 'wind_speed' | 'wind_deg' | 'wind_gust' | 'rain' | 'snow';

// Fields shared across current/hourly/daily forecast entries.
export interface WeatherCommon {
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherConditionIFace[];
  rain?: HourlyPrecipitationIFace;
  snow?: HourlyPrecipitationIFace;
}

export interface CurrentWeather extends WeatherCommon {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
}

export interface HourlyWeather extends WeatherCommon {
  dt: number;
  temp: number;
  feels_like: number;
}

export interface DailyWeather extends WeatherCommon {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: { day: number; night: number; eve: number; morn: number; min: number; max: number };
  feels_like: { day: number; night: number; eve: number; morn: number };
}

export interface OpenWeatherDTOInterface {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}
