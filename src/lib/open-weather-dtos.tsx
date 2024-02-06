import {
  CloudHail, Sunrise, Sunset, Haze, Tornado, SunMoon, CloudSun, CloudFog, Snowflake, CloudLightning, Cloud, Cloudy,
  Wind, Thermometer, CloudRainWind, AlarmSmoke, CloudDrizzle
} from "lucide-react";

const intensity = (i: number) => {
  switch (i) {
    case 1:
      return "#02fff7"
    case 2:
      return "#001dfc"
    case 3:
      return "#9100a6"
    case 4:
      return "#c00000"
  }
}


export const WeatherConditionCodes = {
  200: CloudLightning,
  201: CloudLightning,
  202: CloudLightning,
  210: CloudLightning,
  211: CloudLightning,
  212: CloudLightning,
  221: CloudLightning,
  230: CloudLightning,
  231: CloudLightning,
  232: CloudLightning,
  300: CloudDrizzle,
  301: CloudDrizzle,
  302: CloudDrizzle,
  310: CloudDrizzle,
  311: CloudDrizzle,
  312: CloudDrizzle,
  313: CloudDrizzle,
  314: CloudDrizzle,
  321: CloudDrizzle,
  500: CloudRainWind,
  501: CloudRainWind,
  502: CloudRainWind,
  503: CloudRainWind,
  504: CloudRainWind,
  511: CloudRainWind,
  520: CloudRainWind,
  521: CloudRainWind,
  522: CloudRainWind,
  531: CloudRainWind,
  600: Snowflake,
  601: Snowflake,
  602: Snowflake,
  611: CloudHail,
  612: CloudHail,
  615: CloudHail,
  616: CloudHail,
  620: CloudHail,
  621: CloudHail,
  622: CloudHail,
  701: CloudFog,
  711: AlarmSmoke,
  721: Haze,
  731: Haze,
  741: CloudFog,
  751: Haze,
  761: Haze,
  762: AlarmSmoke,
  771: Wind,
  781: Tornado,
  800: SunMoon,
  801: Cloud,
  802: Cloudy,
  803: Cloudy,
}

export const WeatherIconMapping = {
  sunrise: <Sunrise />,
  sunset: <Sunset />,
  wind: <Wind />,
  thermometer: <Thermometer />,
}

export interface HourlyPrecipitationIFace {
  "1h": number;
}

export interface WeatherConditionIFace {
  id: number;
  main: string;
  description: string;
  icon: string;
}


export interface WeatherDatumIFace {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherConditionIFace[];
  snow?: HourlyPrecipitationIFace;
  rain?: HourlyPrecipitationIFace;
  hourly: WeatherDatumIFace[];
  daily: WeatherDatumIFace[];
}

export interface WeatherDTOIFace {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: WeatherDatumIFace;
  minutely?: WeatherDatumIFace[];
  hourly: WeatherDatumIFace[];
  daily: WeatherDatumIFace[];
}
