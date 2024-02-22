"use client";

import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WidgetWrapper, { WidgetWidthContext, useWidgetWidth } from "@/widgets/widget-wrapper";
import mockWeatherResponse from "@/lib/open-weather-api-resp";
import {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
  WeatherDatumIFace,
} from "@/components/weather-clock/OpenWeatherDTO";
import { DateTime } from "luxon";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { WeatherClock } from "@/components/weather-clock/WeatherClock";
import Debug  from "debug";


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
  console.log("Fetching weather data");
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

const debug = Debug('weather:widget')

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

  const [currentlyDisplayedMetric, setCurrentlyDisplayedMetric] = useState('temp' as OpenWeatherDataMetric)

  useEffect(() => {
    const timerId = setInterval(() => {
      // TODO: rotate through metrics
      // TODO: also verify that react is caching the thing here
      debug('rotating metric')
      setCurrentlyDisplayedMetric('temp')
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
      <WeatherClock openWeatherData={weatherData}  currentlyDisplayedMetric={currentlyDisplayedMetric} size={size}/>
  );
};

export const WrappedWeatherWidget = WidgetWrapper(WeatherWidget, defaultProps);

export default WrappedWeatherWidget

