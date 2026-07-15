import React from "react";
import { cn } from "@/lib/utils";
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
      return `${Math.round(v)}°`;
    case "humidity":
    case "clouds":
      return `${v}%`;
    case "pressure":
      return `${v}`;
    case "wind_speed":
    case "wind_gust":
      return `${Math.round(v)}`;
    case "uvi":
      return `${v}`;
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
      className="no-drag absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <HoverCard openDelay={80}>
        <HoverCardTrigger asChild>
          <div
            className={cn(
              "flex flex-col items-center gap-1 cursor-help transition-colors px-2 py-1 rounded-full",
              isNow
                ? "bg-primary/10 ring-1 ring-primary/40 animate-pulse-glow"
                : "hover:bg-white/[0.02]",
            )}
          >
            <WeatherCondition
              code={primary?.id ?? 800}
              icon={primary?.icon}
              size={iconSize}
              strokeWidth={isNow ? 2 : 1.5}
              className={isNow ? "text-primary" : "text-muted-foreground"}
            />
            <span
              className={cn(
                "font-mono tabular-nums leading-none font-light",
                isNow ? "text-primary" : "text-foreground/75",
              )}
              style={{ fontSize: valuePx }}
            >
              {value}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-60 text-xs font-sans p-4 border-border bg-surface-2"
          side="top"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-muted-foreground">
                {dt?.toFormat("hh:mm a") ?? "—"}
              </span>
              {isNow && (
                <span className="font-mono uppercase text-[9px] tracking-[0.2em] text-primary">
                  Now
                </span>
              )}
            </div>
            <div className="capitalize text-secondary">{primary?.description ?? "—"}</div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 font-mono text-[11px]">
              <span className="text-muted-foreground">Temp</span>
              <span className="text-right tabular-nums">{Math.round(weatherData.temp)}°F</span>
              <span className="text-muted-foreground">Feels</span>
              <span className="text-right tabular-nums">{Math.round(weatherData.feels_like)}°F</span>
              <span className="text-muted-foreground">Humidity</span>
              <span className="text-right tabular-nums">{weatherData.humidity}%</span>
              <span className="text-muted-foreground">Wind</span>
              <span className="text-right tabular-nums">{Math.round(weatherData.wind_speed)} mph</span>
              <span className="text-muted-foreground">Pressure</span>
              <span className="text-right tabular-nums">{weatherData.pressure} hPa</span>
              <span className="text-muted-foreground">UV</span>
              <span className="text-right tabular-nums">{weatherData.uvi}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default React.memo(WeatherClockNode);
