import { DateTime } from "luxon";
import type {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
} from "./OpenWeatherDTO";
import WeatherClockNode, { formatMetric } from "./WeatherClockNode";
import WeatherCondition from "./WeatherCondition";

export interface WeatherClockProps {
  openWeatherData?: OpenWeatherDTOInterface;
  currentMetric: OpenWeatherDataMetric;
  size: { width: number; height: number };
}

const METRIC_LABEL: Record<OpenWeatherDataMetric, string> = {
  temp: "Temp",
  feels_like: "Feels like",
  humidity: "Humidity",
  pressure: "Pressure",
  dew_point: "Dew point",
  uvi: "UV index",
  clouds: "Clouds",
  visibility: "Visibility",
  wind_speed: "Wind",
  wind_deg: "Wind dir",
  wind_gust: "Gust",
  rain: "Rain",
  snow: "Snow",
};

export const WeatherClock = ({
  openWeatherData,
  currentMetric,
  size: { width, height },
}: WeatherClockProps) => {
  // Reserve outer padding so nodes don't clip; use whichever axis is smaller.
  const clockSize = Math.max(160, Math.min(width, height) - 24);
  const radius = clockSize / 2;
  const nodeRingRadius = radius - Math.max(28, clockSize * 0.09);

  const iconSize = Math.max(18, Math.min(48, clockSize * 0.08));
  const valuePx = Math.max(10, Math.min(20, clockSize * 0.035));
  const centerBigPx = Math.max(28, Math.min(120, clockSize * 0.18));
  const centerLabelPx = Math.max(10, Math.min(18, clockSize * 0.03));
  const centerIconPx = Math.max(28, Math.min(72, clockSize * 0.12));

  const nowHour24 = new Date().getHours();

  // Take the next 12 hours (starting at current hour). We DON'T sort — the API
  // gives us chronological hours, and index 0 = "now" reads naturally.
  const hourly = openWeatherData?.hourly?.slice(0, 12) ?? [];

  const currentDescription = openWeatherData?.current?.weather?.[0]?.description ?? "—";
  const currentIcon = openWeatherData?.current?.weather?.[0]?.icon;
  const currentValue = openWeatherData?.current
    ? formatMetric(currentMetric, openWeatherData.current as unknown as Record<string, unknown>)
    : "—";

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="relative"
        style={{ width: clockSize, height: clockSize }}
        data-testid="weather-clock"
      >
        {/* Ring */}
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          aria-hidden
        >
          <circle
            cx={radius}
            cy={radius}
            r={nodeRingRadius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="1"
            opacity="0.35"
          />
          {/* 12 tick marks aligned with hour positions — longer on 12/3/6/9. */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const isCardinal = i % 3 === 0;
            const inset = isCardinal ? 10 : 5;
            const outset = isCardinal ? 4 : 2;
            const x1 = radius + Math.cos(angle) * (nodeRingRadius - inset);
            const y1 = radius + Math.sin(angle) * (nodeRingRadius - inset);
            const x2 = radius + Math.cos(angle) * (nodeRingRadius + outset);
            const y2 = radius + Math.sin(angle) * (nodeRingRadius + outset);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isCardinal ? "var(--primary)" : "var(--muted-foreground)"}
                strokeWidth={isCardinal ? 2 : 1}
                opacity={isCardinal ? 0.7 : 0.4}
              />
            );
          })}
        </svg>

        {/* Hourly nodes around the ring */}
        {hourly.map((h, i) => {
          // -90° rotation so index 0 sits at 12 o'clock; nodes advance clockwise.
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const x = radius + Math.cos(angle) * nodeRingRadius;
          const y = radius + Math.sin(angle) * nodeRingRadius;
          const hourOfDay = DateTime.fromSeconds(h.dt).hour;
          return (
            <WeatherClockNode
              key={i}
              weatherData={h}
              currentMetric={currentMetric as keyof typeof h}
              x={x}
              y={y}
              isNow={hourOfDay === nowHour24}
              iconSize={iconSize}
              valuePx={valuePx}
            />
          );
        })}

        {/* Center: current conditions + rotating metric */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none"
          data-testid="weather-clock-center"
        >
          {currentIcon && (
            <WeatherCondition
              code={openWeatherData?.current?.weather?.[0]?.id ?? 800}
              icon={currentIcon}
              size={centerIconPx}
              className="opacity-95"
            />
          )}
          <div
            className="text-primary tabular-nums font-light leading-none"
            style={{ fontSize: centerBigPx }}
            data-testid="weather-clock-value"
          >
            {currentValue}
          </div>
          <div
            className="text-muted-foreground uppercase tracking-widest"
            style={{ fontSize: centerLabelPx }}
            data-testid="weather-clock-metric-label"
          >
            {METRIC_LABEL[currentMetric] ?? currentMetric}
          </div>
          <div
            className="text-secondary capitalize"
            style={{ fontSize: centerLabelPx }}
          >
            {currentDescription}
          </div>
        </div>

      </div>
    </div>
  );
};

