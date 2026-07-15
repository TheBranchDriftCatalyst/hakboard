import axios from "axios";
import Debug from "debug";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useWidgetWidth } from "@/widgets/widget-wrapper";
import { WeatherClock } from "@/components/weather-clock/WeatherClock";
import type {
  OpenWeatherDataMetric,
  OpenWeatherDTOInterface,
} from "@/components/weather-clock/OpenWeatherDTO";
import { resolveCity } from "@/config/cities";
import { useInterval } from "@/hooks/useInterval";
import { useConfig } from "@/lib/widget-config";

const debug = Debug("weather:widget");

// Metrics cycled in the center of the clock face. Restricted to values that
// exist on the OpenWeather Current payload and have a meaningful formatted
// representation (see WeatherClockNode.formatMetric).
const METRIC_ROTATION: OpenWeatherDataMetric[] = [
  "temp",
  "feels_like",
  "humidity",
  "wind_speed",
  "pressure",
  "clouds",
  "uvi",
];

const fetchWeather = async (lat: number, long: number): Promise<OpenWeatherDTOInterface> => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const response = await axios.get("https://api.openweathermap.org/data/3.0/onecall", {
    params: {
      lat,
      lon: long,
      appid: apiKey,
      exclude: "minutely,alerts",
      units: "imperial",
    },
  });
  return response.data;
};

export const WeatherWidget = () => {
  const { city, metricRotationInterval } = useConfig({
    city: { type: "string", default: "Denver", label: "City" },
    metricRotationInterval: {
      type: "number",
      default: 30,
      min: 5,
      step: 5,
      label: "Metric rotation (seconds)",
    },
  } as const);

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const { data: weatherData } = useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const coords = await resolveCity(city, apiKey);
      return fetchWeather(coords.lat, coords.long);
    },
    // Debounce: give the user 400ms after they stop typing before firing.
    // Combined with resolveCity's in-memory cache, toggling between a few
    // cities is snappy without hammering the geocoding endpoint.
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: false,
  });

  const [currentMetric, setCurrentMetric] = useState<OpenWeatherDataMetric>("temp");

  useInterval(() => {
    setCurrentMetric((prev) => {
      const next = METRIC_ROTATION[(METRIC_ROTATION.indexOf(prev) + 1) % METRIC_ROTATION.length];
      debug("rotating metric", prev, "->", next);
      return next;
    });
  }, metricRotationInterval * 1000);

  const size = useWidgetWidth();

  return (
    <WeatherClock
      openWeatherData={weatherData}
      currentMetric={currentMetric}
      size={size}
    />
  );
};

WeatherWidget.defaultLayout = { w: 20, h: 20 };

export default WeatherWidget;
