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
    const debug = Debug(`weather:clock:node:${props.hour12}`);
    const { hour12, weatherData, style } = props;
    
    debug("WeatherClockNode", {...props, dt: weatherData?.dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)});
    
    const angle = style?.angle
    
    const isNow = useMemo(() => new Date().getHours() % 12 == hour12, [hour12]);

    const {  weather } = weatherData || {weather: [unknownWeatherCondition]}
    const [{id: primaryConditionID, description: primaryDescription }] = weather;
    const ConditionIcon = WeatherConditionCodes[primaryConditionID] as LucideIcon;
    
    
    
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
                        style={{ transform: `rotate(${-angle}rad)` }}
                        className="p-1 aspect-square text-primary rounded-full"
                    >
                        {hour12}
                    </div>
                    <div
                        style={{ transform: `rotate(${-angle}rad)` }}
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
            <HoverCardContent>
              <div className="flex flex-col items-center" style={{position: 'absolute', transform: `rotate(${angle * 2*Math.PI}rad)`}} >
                <span>{weatherData?.dt && weatherData.dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}</span>
                {/* <span>{JSON.stringify(weatherData, {space: 2})}</span> */}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
    );
};

export default React.memo(WeatherClockNode);

