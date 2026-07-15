import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DateTime } from "luxon";
import type { HourlyWeather } from "./OpenWeatherDTO";
import WeatherCondition from "./WeatherCondition";

// Formats a metric value for display around the clock face. Accepts any
// object with numeric metric fields — used for both HourlyWeather and
// CurrentWeather without a common ancestor type.
export const formatMetric = (
  metric: string,
  w: Record<string, unknown>,
): string => {
  const v = w[metric] as number | undefined;
  if (v == null) return "—";
  switch (metric) {
    case "temp":
    case "feels_like":
      return `${Math.round(v as number)}°`;
    case "humidity":
    case "clouds":
      return `${v}%`;
    case "pressure":
      return `${v} hPa`;
    case "wind_speed":
    case "wind_gust":
      return `${Math.round(v as number)} mph`;
    case "uvi":
      return `UV ${v}`;
    default:
      return String(v);
  }
};

interface WeatherClockNodeProps {
  weatherData: HourlyWeather;
  currentMetric: keyof HourlyWeather;
  x: number;
  y: number;
  isNow: boolean;
  iconSize: number;
  valuePx: number;
}

export const WeatherClockNode = ({
  weatherData,
  currentMetric,
  x,
  y,
  isNow,
  iconSize,
  valuePx,
}: WeatherClockNodeProps) => {
  const primary = weatherData?.weather?.[0];
  const dt = weatherData?.dt != null ? DateTime.fromSeconds(weatherData.dt) : null;
  const value = formatMetric(currentMetric as string, weatherData as unknown as Record<string, unknown>);

  return (
    <div
      data-testid="weather-clock-node"
      className="no-drag absolute flex flex-col items-center gap-0.5"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center gap-0.5 cursor-help">
            <WeatherCondition
              code={primary?.id ?? 800}
              icon={primary?.icon}
              size={iconSize}
              className={isNow ? "drop-shadow-[0_0_6px_currentColor] text-primary" : "opacity-90"}
            />
            <span
              className={`tabular-nums leading-none font-light ${
                isNow ? "text-primary" : "text-secondary"
              }`}
              style={{ fontSize: valuePx }}
            >
              {value}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-56 text-xs" side="top">
          <div className="flex flex-col gap-1">
            <div className="text-primary font-semibold">
              {dt?.toFormat("hh:mm a") ?? "—"}
            </div>
            <div className="text-muted-foreground capitalize">
              {primary?.description ?? "—"}
            </div>
            <div className="grid grid-cols-2 gap-x-2 pt-1">
              <span>Temp</span><span className="text-right">{Math.round(weatherData.temp)}°</span>
              <span>Feels</span><span className="text-right">{Math.round(weatherData.feels_like)}°</span>
              <span>Humidity</span><span className="text-right">{weatherData.humidity}%</span>
              <span>Wind</span><span className="text-right">{Math.round(weatherData.wind_speed)} mph</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default React.memo(WeatherClockNode);
