//  This is going to hold the data node for the weather at that hour.
// - Each node represents the weather at that hour.
// - The node will contain the temperature, the weather condition, or the time.  We will rotate through the different metrics.

import { HelpCircle, LucideIcon } from "lucide-react";
import {
    CloudHail,
    Sunrise,
    Sunset,
    Haze,
    Tornado,
    SunMoon,
    CloudSun,
    CloudFog,
    Snowflake,
    CloudLightning,
    Cloud,
    Cloudy,
    Wind,
    Thermometer,
    CloudRainWind,
    AlarmSmoke,
    CloudDrizzle,
    LucideIcon as LucidIcon,
} from "lucide-react";
import React, { useMemo } from "react";
import { OpenWeatherIconMapping, WeatherConditionIFace, WeatherDatumIFace } from "./OpenWeatherDTO";
import Debug from "debug";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { DateTime } from "luxon";

export const WeatherConditionCodes: OpenWeatherIconMapping | 9999 = {
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
    804: Cloudy,
    9999: HelpCircle,
};

interface ClockNodeStyleProps extends React.CSSProperties {
    x: number;
    y: number;
    angle?: number;
}

const unknownWeatherCondition: WeatherConditionIFace | {id: 9999, description: string} = {
  id: 9999, 
  description: "unknown condition"
};

interface WeatherClockNodeInterface {
    // hour:  0| 2| 3| 4| 5| 6| 7| 8| 9| 10| 11| 12| 13| 14| 15| 16| 17| 18| 19| 20| 21| 22| 23;
    weatherData: WeatherDatumIFace;
    style?: ClockNodeStyleProps;
}

export const WeatherClockNode = (props: any) => {
    const debug = Debug(`weather:clock:node:${props.nodeIndex}`);
    const { key, weatherData, style } = props;
    const hour12 = weatherData?.dt.hour % 12 || 12;
    debug("WeatherClockNode", {...props, dt: weatherData?.dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)});
    
    const { counterRotationStyles, angle } = props.rotation
    // const angle = style?.angle
    
    const isNow = useMemo(() => new Date().getHours() % 12 == hour12, [hour12]);

    const {  weather } = weatherData || {weather: [unknownWeatherCondition]}
    const [{id: primaryConditionID, description: primaryDescription }] = weather;
    const ConditionIcon = WeatherConditionCodes[primaryConditionID] as LucideIcon;
    
    // // the weather api returns 48 hours of the next data, where index openWeatherData.hourly[0] === currentWeather
      // // we need to map between the nodeIndex (location in the ui) starting at index 0 = 12 o-clock and the index in the hourly data,
      // // we also need to determine if the current node is the current hour
      // const nodeHour12 = index == 0 ? 12 : index;
      // const now = DateTime.now();
      // const currentHour24 = new Date().getHours();
      // const currentHour12 = currentHour24 % 12;
      // const dataOffset = Math.abs(12 - currentHour12);
      // const weatherDataIndex = (index + dataOffset) % 12;
      // const weatherData = openWeatherData?.hourly[weatherDataIndex];

      // const isNow = currentHour24 % 12 == nodeHour12;
      // const { sunset, sunrise } = openWeatherData?.current || {};
      // console.log({
      //   nodeHour12,
      //   currentHour24,
      //   index,
      //   nodeTime: hourlyWeatherData?.dt.toLocaleString(DateTime.DATETIME_FULL),
      //   nodeTimeHour: hourlyWeatherData?.dt.hour,
      //   // sunset: sunset && DateTime.fromSeconds(sunset).toLocaleString(DateTime.DATETIME_FULL),
      //   // sunrise: sunrise && DateTime.fromSeconds(sunrise).toLocaleString(DateTime.DATETIME_FULL),
      // })
      // const isSunset = sunset && DateTime.fromSeconds(sunset).hasSame()
      // const isSunrise = sunrise && DateTime.fromSeconds(sunrise).hour == nodeHour12
    
    if (!ConditionIcon && primaryConditionID !== 9999) {
        console.warn(`No condition icon for code ${primaryConditionID}`, {weatherData});
    }

    return (
        <div style={style} >
          <HoverCard>
            <HoverCardTrigger>
              <div className={`w-28 h-16`} style={{ position: "relative" }}>
                <div
                    className={`w-full h-full flex justify-center items-center`}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%)`,
                    }}
                >
                    <div
                        style={{ ...counterRotationStyles }}
                        className="p-1 aspect-square text-primary rounded-full"
                    >
                        {hour12}
                    </div>
                    <div
                        style={{ ...counterRotationStyles }}
                        className="w-full h-full"
                    >
                    {ConditionIcon && (
                            <ConditionIcon
                                className={`${
                                    isNow
                                        ? "text-primary animate-pulse"
                                        : ""
                                } w-full h-full`}
                            />
                        )}

                    </div>
                </div>
            </div>
            </HoverCardTrigger>
            <HoverCardContent style={{ ...counterRotationStyles }}>
              <div >
                <span>{weatherData?.dt && weatherData.dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}</span>
                <span>{JSON.stringify(weatherData, null, 2)}</span>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
    );
};

export default React.memo(WeatherClockNode);

