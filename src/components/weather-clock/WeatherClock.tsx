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
  humidity: "%",
  clouds: "%",
  pressure: "hPa",
  wind_speed: "mph",
  wind_gust: "mph",
};

const IS_TEMP_METRIC = (m: OpenWeatherDataMetric) =>
  m === "temp" || m === "feels_like" || m === "dew_point";

const CARDINAL_LABELS = ["12", "3", "6", "9"];

// A degree symbol rendered with tighter kerning than IBM Plex Mono's
// tabular slot allows — used for both hourly and center temperature values.
const DegreeMark = ({ scale = 1 }: { scale?: number }) => (
  <span
    aria-hidden
    className="font-sans"
    style={{ marginLeft: `${-0.12 * scale}em`, fontSize: `${0.72 * scale}em` }}
  >
    °
  </span>
);

export const WeatherClock = ({
  openWeatherData,
  currentMetric,
  size: { width, height },
}: WeatherClockProps) => {
  // Reserve outer padding for the cardinal labels sitting outside the ring.
  const outerPad = 22;
  const clockSize = Math.max(180, Math.min(width, height) - outerPad * 2);
  const radius = clockSize / 2;
  const nodeRingRadius = radius - Math.max(38, clockSize * 0.12);
  const outerRingRadius = radius - 2;
  const labelRadius = radius + Math.max(10, clockSize * 0.03); // OUTSIDE outer ring

  const iconSize = Math.max(16, Math.min(34, clockSize * 0.07));
  const valuePx = Math.max(10, Math.min(15, clockSize * 0.032));
  const centerIconPx = Math.max(24, Math.min(56, clockSize * 0.1));
  const centerValuePx = Math.max(32, Math.min(96, clockSize * 0.16));
  const centerUnitPx = Math.max(11, Math.min(20, clockSize * 0.035));
  const cardinalPx = Math.max(9, Math.min(13, clockSize * 0.028));
  const centerLabelPx = Math.max(9, Math.min(13, clockSize * 0.022));

  const nowHour24 = new Date().getHours();
  const hourly = openWeatherData?.hourly?.slice(0, 12) ?? [];

  const currentDescription = openWeatherData?.current?.weather?.[0]?.description ?? "";
  const currentIconCode = openWeatherData?.current?.weather?.[0]?.id;
  const currentIcon = openWeatherData?.current?.weather?.[0]?.icon;
  const currentValueRaw = openWeatherData?.current
    ? formatMetric(currentMetric, openWeatherData.current as unknown as Record<string, unknown>)
    : "—";
  // formatMetric already appends ° for temp; strip it so we can render our own
  // tight-kerned DegreeMark instead of the wide tabular-slot version.
  const isTempMetric = IS_TEMP_METRIC(currentMetric);
  const centerValue = isTempMetric ? currentValueRaw.replace("°", "") : currentValueRaw;
  const centerUnit = isTempMetric ? null : METRIC_UNIT[currentMetric];

  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <div
        className="relative"
        style={{
          width: clockSize + outerPad * 2,
          height: clockSize + outerPad * 2,
        }}
        data-testid="weather-clock"
      >
        {/* SVG rings + non-cardinal tick marks */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: outerPad, top: outerPad, width: clockSize, height: clockSize }}
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          aria-hidden
        >
          {/* outer ring */}
          <circle
            cx={radius}
            cy={radius}
            r={outerRingRadius}
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
            opacity={0.22}
          />
          {/* 12 tick marks: cardinal ones are subtle nubs (labels replace them);
              others are short lines pointing inward from outer ring. */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const isCardinal = i % 3 === 0;
            const outer = outerRingRadius - (isCardinal ? 2 : 3);
            const inner = outerRingRadius - (isCardinal ? 6 : 10);
            const x1 = radius + Math.cos(angle) * inner;
            const y1 = radius + Math.sin(angle) * inner;
            const x2 = radius + Math.cos(angle) * outer;
            const y2 = radius + Math.sin(angle) * outer;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isCardinal ? "var(--primary)" : "var(--muted-foreground)"}
                strokeWidth={isCardinal ? 1.5 : 1}
                opacity={isCardinal ? 0.7 : 0.3}
              />
            );
          })}
        </svg>

        {/* Cardinal labels placed OUTSIDE the outer ring — no clash with
            hourly nodes or the now-chip. */}
        {[0, 3, 6, 9].map((slot, i) => {
          const angle = (slot / 12) * 2 * Math.PI - Math.PI / 2;
          const x = outerPad + radius + Math.cos(angle) * labelRadius;
          const y = outerPad + radius + Math.sin(angle) * labelRadius;
          return (
            <div
              key={slot}
              className="absolute font-mono text-muted-foreground leading-none pointer-events-none tabular-nums"
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
          const x = outerPad + radius + Math.cos(angle) * nodeRingRadius;
          const y = outerPad + radius + Math.sin(angle) * nodeRingRadius;
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
          className="absolute flex flex-col items-center justify-center gap-2 pointer-events-none px-4 text-center"
          style={{
            left: outerPad,
            top: outerPad,
            width: clockSize,
            height: clockSize,
          }}
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
          <div
            className="flex items-baseline font-mono tabular-nums leading-none text-primary font-extralight"
            style={{ fontSize: centerValuePx }}
            data-testid="weather-clock-value"
          >
            <span>{centerValue}</span>
            {isTempMetric && <DegreeMark />}
            {centerUnit && (
              <span
                className="text-primary/50 font-light font-sans ml-1"
                style={{ fontSize: centerUnitPx }}
              >
                {centerUnit}
              </span>
            )}
          </div>
          <div className="h-px w-10 bg-primary/30" />
          <div
            className="font-mono uppercase text-muted-foreground whitespace-nowrap"
            style={{ fontSize: centerLabelPx, letterSpacing: "0.3em" }}
            data-testid="weather-clock-metric-label"
          >
            {METRIC_LABEL[currentMetric] ?? currentMetric}
          </div>
          {currentDescription && (
            <div
              className="text-secondary capitalize truncate max-w-full"
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

export { DegreeMark };
