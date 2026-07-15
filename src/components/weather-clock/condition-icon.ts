import {
  Cloud,
  Cloudy,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  HelpCircle,
  Moon,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

// Map OpenWeather condition codes → Lucide icons. Reference:
// https://openweathermap.org/weather-conditions
export const getConditionIcon = (code: number, isNight: boolean): LucideIcon => {
  if (code >= 200 && code < 300) return CloudLightning;   // thunderstorm
  if (code >= 300 && code < 400) return CloudDrizzle;     // drizzle
  if (code >= 500 && code < 600) return CloudRain;        // rain
  if (code >= 600 && code < 700) return CloudSnow;        // snow
  if (code === 701 || code === 741) return CloudFog;      // mist / fog
  if (code === 711 || code === 762) return Wind;          // smoke / ash
  if (code === 721) return CloudFog;                       // haze
  if (code >= 700 && code < 800) return Wind;             // sand / dust / squall / tornado
  if (code === 800) return isNight ? Moon : Sun;          // clear
  if (code === 801) return isNight ? CloudMoon : CloudSun; // few clouds
  if (code === 802 || code === 803) return Cloud;         // scattered / broken
  if (code === 804) return Cloudy;                        // overcast
  return HelpCircle;
};

// OpenWeather icon codes end in 'd' or 'n' to indicate day/night variants.
export const isNightIcon = (icon?: string): boolean =>
  Boolean(icon && icon.endsWith("n"));
