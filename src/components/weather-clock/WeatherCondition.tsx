import type { OpenWeatherConditionCodes } from "./OpenWeatherDTO";

interface WeatherConditionProps {
  code: OpenWeatherConditionCodes;
  icon?: string;
  size?: number;
  className?: string;
  time?: string;
}

export const WeatherCondition = ({
  code,
  icon,
  size = 48,
  className,
}: WeatherConditionProps) => {
  const iconCode = icon ?? "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <img
      src={iconUrl}
      alt={`Weather condition ${code}`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={className}
    />
  );
};

export default WeatherCondition;
