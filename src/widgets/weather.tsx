import axios from "axios";
import Debug from "debug";
import { DateTime } from "luxon";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useWidgetWidth } from "@/widgets/widget-wrapper";
import { WeatherClock } from "@/components/weather-clock/WeatherClock";
import type {
  OpenWeatherDataMetric,
  OpenWeatherDTOInterface,
  WeatherDatumIFace,
} from "@/components/weather-clock/OpenWeatherDTO";
import { lookupCity } from "@/config/cities";
import { useInterval } from "@/hooks/useInterval";
import { useConfig } from "@/lib/widget-config";

const debug = Debug("weather:widget");

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

  const { data: weatherData } = useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const coords = lookupCity(city);
      if (!coords) throw new Error(`Unknown city: ${city}`);
      const data = await fetchWeather(coords.lat, coords.long);
      data.hourly = data.hourly.map((curr: WeatherDatumIFace) => ({
        ...curr,
        dt: DateTime.fromSeconds(curr.dt as number) as unknown as number,
      }));
      return data;
    },
    refetchInterval: 10 * 60 * 1000,
  });

  const [currentMetric, setCurrentMetric] = useState<OpenWeatherDataMetric>("temp");

  useInterval(() => {
    debug("rotating metric");
    setCurrentMetric("temp");
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
