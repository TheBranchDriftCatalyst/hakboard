"use client";

import { useEffect, useState } from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import WidgetWrapper from "@/widgets/widget-wrapper";
import {
  CloudHail, Sunrise, Sunset, Haze, Tornado, SunMoon, CloudSun, CloudFog, Snowflake, CloudLightning, Cloud, Cloudy,
  Wind, Thermometer, CloudRainWind, AlarmSmoke, CloudDrizzle, Sun, LucidePersonStanding
} from "lucide-react";
import mockWeatherResponse from '@/lib/open-weather-api-resp';
import {WeatherConditionCodes, WeatherDatumIFace, WeatherDTOIFace as OpenWeatherDTO} from "@/lib/open-weather-dtos";
import {DateTime}  from 'luxon';
import axios from 'axios';
import { Button } from '@/components/ui/button';

// export const WeatherIconMapping = {
//   sunrise: <Sunrise />,
//   sunset: <Sunset />,
//   wind: <Wind />,
//   thermometer: <Thermometer />,
// }

interface WeatherWidgetProps {
  lat?: number;
  long?: number;
}

const defaultProps: WeatherWidgetProps = {
  lat: 39.7392,
  long: -104.9903
}

const fetchWeather = async (long: number | undefined, lat: number | undefined): Promise<OpenWeatherDTO> => {
  console.log('Fetching weather data');
  const baseUrl: string = "https://api.openweathermap.org/data/3.0/onecall";
  const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

  try {
    const response = await axios.get(baseUrl, {
      params: {
        lat: lat,
        lon: long,
        appid: apiKey,
        exclude: "minutely,alerts",
        units: "imperial"
      }
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Rethrow or handle error as needed
  }
}

function formatTime(date: Date) {
  // Convert the JavaScript Date object to a Luxon DateTime object
  const dt = DateTime.fromJSDate(date);

  // Format the time as "hh:mm a" -> "hour:minute AM/PM"
  return dt.toFormat('h:mm a');
}


export const WeatherWidget = ({lat, long}: WeatherWidgetProps = defaultProps) => {

  const interval = 10 * 60000; // 10 minutes
  const [isLoading, setIsLoading] = useState(true);

  const [
    currentWeather,
    setCurrentWeather
  ] = useState<WeatherDatumIFace>();

  useEffect(() => {
    fetchWeather(long, lat).then((weatherData) => {
      console.log('Weather weatherData:', weatherData);
      setCurrentWeather(weatherData.current);
      setIsLoading(false);
    });

  //   const timer = setInterval(() => {
  //     fetchWeather(long, lat).then((data) => {
  //     console.log('Weather data:', data);
  //   });
  //   }, interval);
  //
  //   return () => clearInterval(timer);
  }, [interval, long, lat]);

  const  {
    temp,
    wind_speed,
    wind_gust = null,
    sunset,
    sunrise,
    uvi,
    weather
  } = currentWeather || {};

  const [weather_condition, ...rest] = weather || [];
  const {description, id } = weather_condition || {};

  // @ts-ignore
  const ConditionIcon = WeatherConditionCodes[id] || CloudSun; // TODO: not a fan of this

  if (isLoading) {
    return (
      <CardContent>
        <div>Loading...</div>
      </CardContent>
    )
  }

  return (
      <CardContent>
          <div className="flex flex-row space-x-1">
            <Thermometer className="shrink"/>
            <span>{temp}&deg;F</span>
            { uvi && uvi > 0 && <span><Sun className="inline"/> {uvi}</span>}
          </div>

          <div className="flex flex-col space-x-1">
            <ConditionIcon size={128}/>
            <div>{description}</div>
          </div>

          <div className="shrink"> <Wind className="inline" /> <span>{wind_speed} {wind_gust != 0 && `(${wind_gust})`} mph</span></div>

          {/* <Button className="draggable-cancel" onClick={() => fetchWeather(long, lat)}>Refresh</Button> */}
          {/*<div className="flex">*/}
          {/*  <Sunrise className="inline" />*/}
          {/*  <span>{formatTime(new Date(sunrise))}</span>*/}
          {/*  <Sunset className="inline" />*/}
          {/*  <span>{formatTime(new Date(sunset))}</span>*/}
          {/*</div>*/}
      </CardContent>
  );
};

export default WidgetWrapper(WeatherWidget, defaultProps)
