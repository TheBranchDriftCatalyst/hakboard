import React, { useState, useEffect, useMemo } from "react";
import {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
} from "./OpenWeatherDTO";
import { SizeMe } from "react-sizeme";
import { Cloud } from "lucide-react";
import Debug from "debug";
import WeatherClockNode, { WeatherConditionCodes } from "./WeatherClockNode";
import { DateTime } from "luxon";

const debug = Debug("weather:clock");

export interface SizerProps {
  size: { width: number; height: number };
}

export interface WeatherClockProps extends SizerProps {
  openWeatherData: OpenWeatherDTOInterface;
  currentlyDisplayedMetric?: OpenWeatherDataMetric;
}

// This is one the few times I actually need to use trig!
// The way this clock is constructed is that we place HourNodes around the circumference of a circle.
// Each node represents the weather at that hour. Each node need to be rotated around a correct angle then, the inner content is rotated
// in the opposite direction to keep it upright.

const getWeatherDataForNodeIndex = (weatherData, hour12) => {
  if (!weatherData) {
    return { am: {}, pm: {} };
  }

  const hour24AM = hour12 % 12; // Convert 12-hour time to 24-hour time for AM
  const hour24PM = (hour12 % 12) + 12; // Convert 12-hour time to 24-hour time for PM

  return {
    am: weatherData[hour24AM] || {},
    pm: weatherData[hour24PM] || {},
  };
};

export const WeatherClock = ({
  openWeatherData,
  currentlyDisplayedMetric,
  size: { width, height },
}: WeatherClockProps) => {
  const clockSize = Math.max(Math.min(width, height) * 0.75, 10);
  const radius = clockSize / 2;

  const hourlyForecastNodes = Array.from({ length: 12 }).map((_, index) => {
    // styling and rotation and location constants
    const rotationFactor = -((90 * Math.PI) / 180); // rotate to the counterclockwise 90 degrees, otherwise we start at 3 o-clock, 0=24|12
    const angle = (index / 12) * 2 * Math.PI + rotationFactor; // Angle in radians
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;
    const rotationProps = { x, y, angle, rotationFactor };
    // the weather api returns 48 hours of the next data, where index openWeatherData.hourly[0] === currentWeather
    // we need to map between the nodeIndex (location in the ui) and the index in the hourly data, we also need to determine
    // if the current node is the current hour
    const hour12 = index == 0 ? 12 : index;
    const currentHour24 = new Date().getHours();
    // not sure why its a 3 offset... but this works and shows the
    // current hour, past (tomorrows) hours, and the immediate next hours
    //  this could be changing in size each hour... i am not sure if so. i  think we need to do like index + (12 - index) % 12 
    // (ie, i think the offset is the distance from the reset point (nodeINdex))
    const weatherDataIndex = ((index + 2) % 12);
    // const weatherDataIndex = ((index + (12 - hour12)) % 12);
    const weatherData = openWeatherData?.hourly[weatherDataIndex];

    // DateTime.fromSeconds(openWeatherData.current.sunrise).getHours()
    // DateTime.fromSeconds(openWeatherData.current.sunset)

    const isNow = currentHour24 % 12 == hour12;
    const isSunset =
      openWeatherData?.current?.sunset &&
      DateTime.fromSeconds(openWeatherData?.current?.sunset).hour % 12 == hour12 && openWeatherData?.current?.sunset;
    const isSunrise =
      openWeatherData?.current?.sunrise &&
      DateTime.fromSeconds(openWeatherData?.current?.sunrise).hour % 12 == hour12 && openWeatherData?.current?.sunrise;

    return (
      <WeatherClockNode
        key={index}
        rotationProps={rotationProps}
        weatherData={weatherData}
        style={{
          position: "absolute",
          angle,
          x,
          y,
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) rotate(${angle}rad)`,
        }}
        // key={index} delete the rest of these after moving them into the component
        nodeIndex={index}
        dataIndex={weatherDataIndex}
        hour12={hour12} // get rid of this shortly
        isNow={isNow}
        sunset={isSunset}
        sunrise={isSunrise}
      />
    );
  });

  const currentConditions = openWeatherData?.current?.weather[0]?.id;
  const primaryDescription = openWeatherData?.current?.weather[0]?.description;
  const CurrentConditions = WeatherConditionCodes[currentConditions];

  return (
    <div
      className="border-primary border-2 flex justify-center items-center w-full h-full"
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: `${clockSize}px`,
          height: `${clockSize}px`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {hourlyForecastNodes}
        <div
          id="currentConditionNode"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: `${clockSize / 1.75}px`,
            // height: `${clockSize / 1.75}px`,
          }}
        >
          <div
            // className="flex-col justify-center items-center border-1 rounded-full border-destructive border h-full w-full"
            style={{
              // position: "absolute",
              // width: `${clockSize / 2}px`,
              // height: `${clockSize / 2}px`,
            }}
          >
            {CurrentConditions && <CurrentConditions className="w-16 h-16" />}
            <div className="">{primaryDescription}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const WeatherClock = ({openWeatherData, currentlyDisplayedMetric}: WeatherClockProps) => {
//  saving for the rotation logic
//   return (
//     <div className="clock h-full w-full">
//       <div
//         className="hour_hand"
//         style={{
//           transform: `rotateZ(${time.getHours() * 30}deg)`,
//         }}
//       />
//       <div
//         className="min_hand"
//         style={{
//           transform: `rotateZ(${time.getMinutes() * 6}deg)`,
//         }}
//       />
//       <div
//         className="sec_hand"
//         style={{
//           transform: `rotateZ(${time.getSeconds() * 6}deg)`,
//         }}
//       />
//       <span className="twelve">12</span>
//       <span className="one">1</span>
//       <span className="two">2</span>
//       <span className="three">3</span>
//       <span className="four">4</span>
//       <span className="five">5</span>
//       <span className="six">6</span>
//       <span className="seven">7</span>
//       <span className="eight">8</span>
//       <span className="nine">9</span>
//       <span className="ten">10</span>
//     <span className="eleven">11</span>
//     </div>
//   );
// }
