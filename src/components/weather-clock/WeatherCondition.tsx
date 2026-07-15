import type { OpenWeatherConditionCodes } from "./OpenWeatherDTO";
import { getConditionIcon, isNightIcon } from "./condition-icon";

interface WeatherConditionProps {
  code: OpenWeatherConditionCodes;
  icon?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  time?: string;
}

export const WeatherCondition = ({
  code,
  icon,
  size = 32,
  strokeWidth = 1.5,
  className,
}: WeatherConditionProps) => {
  const Icon = getConditionIcon(code, isNightIcon(icon));
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
};

export default WeatherCondition;
