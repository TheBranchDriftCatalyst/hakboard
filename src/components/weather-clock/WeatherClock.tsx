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
  temp: "Temperature",
  feels_like: "Feels Like",
  humidity: "Humidity",
  pressure: "Pressure",
  dew_point: "Dew Point",
  uvi: "UV Index",
  clouds: "Cloud Cover",
  visibility: "Visibility",
  wind_speed: "Wind Speed",
  wind_deg: "Wind Direction",
  wind_gust: "Wind Gust",
  rain: "Rain",
  snow: "Snow",
};

const METRIC_UNIT: Partial<Record<OpenWeatherDataMetric, string>> = {
  temp: "°F",
  feels_like: "°F",
  humidity: "%",
  clouds: "%",
  pressure: "hPa",
  wind_speed: "mph",
  wind_gust: "mph",
  uvi: "UV",
};

const CARDINAL_LABELS = ["12", "3", "6", "9"];

export const WeatherClock = ({
  openWeatherData,
  currentMetric,
  size: { width, height },
}: WeatherClockProps) => {
  const clockSize = Math.max(180, Math.min(width, height) - 32);
  const radius = clockSize / 2;
  const nodeRingRadius = radius - Math.max(32, clockSize * 0.11);
  const labelRingRadius = radius - Math.max(12, clockSize * 0.04);

  const iconSize = Math.max(16, Math.min(36, clockSize * 0.075));
  const valuePx = Math.max(10, Math.min(16, clockSize * 0.033));
  const centerIconPx = Math.max(24, Math.min(56, clockSize * 0.1));
  const centerValuePx = Math.max(32, Math.min(96, clockSize * 0.17));
  const centerUnitPx = Math.max(12, Math.min(24, clockSize * 0.04));
  const cardinalPx = Math.max(9, Math.min(14, clockSize * 0.028));
  const centerLabelPx = Math.max(9, Math.min(13, clockSize * 0.022));

  const nowHour24 = new Date().getHours();
  const hourly = openWeatherData?.hourly?.slice(0, 12) ?? [];

  const currentDescription = openWeatherData?.current?.weather?.[0]?.description ?? "";
  const currentIconCode = openWeatherData?.current?.weather?.[0]?.id;
  const currentIcon = openWeatherData?.current?.weather?.[0]?.icon;
  const currentValue = openWeatherData?.current
    ? formatMetric(currentMetric, openWeatherData.current as unknown as Record<string, unknown>)
    : "—";
  const currentUnit = METRIC_UNIT[currentMetric] ?? "";

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="relative"
        style={{ width: clockSize, height: clockSize }}
        data-testid="weather-clock"
      >
        {/* Concentric rings */}
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          aria-hidden
        >
          {/* outer ring */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 2}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
          {/* inner (node) ring */}
          <circle
            cx={radius}
            cy={radius}
            r={nodeRingRadius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={1}
            opacity={0.25}
          />
          {/* 12 tick marks aligned with hour positions */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const isCardinal = i % 3 === 0;
            const inset = isCardinal ? 12 : 6;
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
                strokeWidth={isCardinal ? 1.5 : 1}
                opacity={isCardinal ? 0.7 : 0.35}
              />
            );
          })}
        </svg>

        {/* Cardinal hour labels (12, 3, 6, 9) placed just outside the ring */}
        {[0, 3, 6, 9].map((slot, i) => {
          const angle = (slot / 12) * 2 * Math.PI - Math.PI / 2;
          const x = radius + Math.cos(angle) * labelRingRadius;
          const y = radius + Math.sin(angle) * labelRingRadius;
          return (
            <div
              key={slot}
              className="absolute font-mono text-muted-foreground/60 leading-none pointer-events-none"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                fontSize: cardinalPx,
              }}
            >
              {CARDINAL_LABELS[i]}
            </div>
          );
        })}

        {/* Hourly nodes positioned by their real hour-of-day */}
        {hourly.map((h) => {
          const hourOfDay = DateTime.fromSeconds(h.dt).hour;
          const clockSlot = hourOfDay % 12;
          const angle = (clockSlot / 12) * 2 * Math.PI - Math.PI / 2;
          const x = radius + Math.cos(angle) * nodeRingRadius;
          const y = radius + Math.sin(angle) * nodeRingRadius;
          return (
            <WeatherClockNode
              key={hourOfDay}
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
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none px-4"
          data-testid="weather-clock-center"
        >
          {currentIconCode != null && (
            <WeatherCondition
              code={currentIconCode}
              icon={currentIcon}
              size={centerIconPx}
              strokeWidth={1.25}
              className="text-primary/90"
            />
          )}
          <div className="flex items-baseline gap-1.5 font-mono tabular-nums leading-none">
            <span
              className="text-primary font-extralight"
              style={{ fontSize: centerValuePx }}
              data-testid="weather-clock-value"
            >
              {currentValue}
            </span>
            {currentUnit && !currentValue.includes("°") && (
              <span
                className="text-primary/50 font-light"
                style={{ fontSize: centerUnitPx }}
              >
                {currentUnit}
              </span>
            )}
          </div>
          <div className="h-px w-12 bg-primary/30" />
          <div
            className="font-mono uppercase text-muted-foreground text-center"
            style={{ fontSize: centerLabelPx, letterSpacing: "0.3em" }}
            data-testid="weather-clock-metric-label"
          >
            {METRIC_LABEL[currentMetric] ?? currentMetric}
          </div>
          {currentDescription && (
            <div
              className="text-secondary capitalize"
              style={{ fontSize: centerLabelPx * 1.15 }}
            >
              {currentDescription}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
