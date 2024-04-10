"use client";

import WidgetWrapper, { useWidgetWidth } from "@/components/ResponsiveGridWidget";
import { WeatherClock } from "@/components/WeatherClock/WeatherClock";
import {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
  WeatherDatumIFace,
} from "@/components/WeatherClock/providers/OpenWeatherDTO";
import { createDebugger } from "@/lib/debug";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  city?: string;
  metricRotationInterval?: number;
}

const defaultProps: Required<WeatherWidgetProps> = {
  city: "Denver",
  metricRotationInterval: 30,
};

export const defaultGridSizes = {
    w: 20,
    h: 20,
}

const fetchWeather = async (
  long: number | undefined,
  lat: number | undefined
): Promise<OpenWeatherDTOInterface> => {
  const baseUrl: string = "https://api.openweathermap.org/data/3.0/onecall";
  const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

  try {
    const response = await axios.get(baseUrl, {
      params: {
        lat: lat,
        lon: long,
        appid: apiKey,
        exclude: "minutely,alerts",
        units: "imperial",
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Rethrow or handle error as needed
  }
};

const debug = createDebugger('weather:widget')

const asyncGeoCoding = async (city: string) => {
  const dumbMap: Record<string, {lat: number, long: number}> = {
    denver: { lat: 39.7392, long: -104.9903 },
  }
  return dumbMap[city.toLowerCase()]
}

const WeatherWidget = ({
  city = defaultProps.city,
  metricRotationInterval = defaultProps.metricRotationInterval,
}: WeatherWidgetProps = defaultProps) => {

  // useQuery hook usage
  const { data: weatherData, isLoading, isError, error } = useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      if (!city) {
        throw new Error("City is required");
      }
      const { lat, long } = await asyncGeoCoding(city);
      const weatherData = await fetchWeather(long, lat)
      // convert to a lookup table
      weatherData.hourly = weatherData.hourly.map((curr: WeatherDatumIFace, index) => {
        const dt = DateTime.fromSeconds(curr?.dt)
        curr.dt = dt
        return curr
      })

      return weatherData
    },
    refetchInterval: 10 * 60000, // 10 minutes
  });

  const [currentMetric, setCurrentMetric] = useState('temp' as OpenWeatherDataMetric)

  useEffect(() => {
    const timerId = setInterval(() => {
      debug('rotating metric')
      setCurrentMetric('temp')
    }, 1000 * metricRotationInterval) // 30 seconds
    return () => clearInterval(timerId)
  }, [weatherData, city, metricRotationInterval])

  const size = useWidgetWidth()

  debug('weatherData', {
    weatherData,
    isLoading,
    isError,
    error,
    size
  })

  return (
      <WeatherClock 
        openWeatherData={weatherData}
        size={size}
      />
  );
};

export const WrappedWeatherWidget = WidgetWrapper(WeatherWidget, defaultProps);

export default WrappedWeatherWidget

