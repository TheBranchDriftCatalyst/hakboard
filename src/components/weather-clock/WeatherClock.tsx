import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
} from "./OpenWeatherDTO";
import { SizeMe } from "react-sizeme";
import { Cloud } from "lucide-react";
import Debug from "debug";
import WeatherClockNode, { WeatherConditionCodes } from "./WeatherClockNode";
import { DateTime } from "luxon";
import { chain } from "lodash";

const debug = Debug("weather:clock");

export interface SizerProps {
  size: { width: number; height: number };
}

export interface WeatherClockProps extends SizerProps {
  openWeatherData: OpenWeatherDTOInterface;
  currentlyDisplayedMetric?: OpenWeatherDataMetric;
}

// if (!Array.prototype.tap) {
//   Array.prototype.tap = function(callback) {
//     callback(this); // Call the callback function with the array as its argument
//     return this; // Return the array to allow further chaining
//   };
// }


// This is one the few times I actually need to use trig!
// The way this clock is constructed is that we place HourNodes around the circumference of a circle.
// Each node represents the weather at that hour. Each node need to be rotated around a correct angle then, the inner content is rotated
// in the opposite direction to keep it upright.

export const WeatherClock = ({
  openWeatherData,
  currentlyDisplayedMetric,
  size: { width, height },
}: WeatherClockProps) => {
  const clockSize = Math.max(Math.min(width, height) * 0.75, 10);
  const radius = clockSize / 2;

  const hourlyForecastNodes = openWeatherData?.hourly
    ?.slice()
    .slice(0, 12) // Take the first 12 elements representing the next 12 hours of forecasts
    .sort((a, b) => (a.dt.hour % 12) - (b.dt.hour % 12)) // Sort by hour, such that index 0 is 12 o-clock not current hour
    .map((hourlyWeatherData, index) => {
      const rotationFactor = -((90 * Math.PI) / 180); // rotate to the counterclockwise 90 degrees, otherwise we start at 3 o-clock, 0=24|12
      const angle = (index / 12) * 2 * Math.PI + rotationFactor; // Angle in radians
      const x = radius * Math.cos(angle) + radius;
      const y = radius * Math.sin(angle) + radius;
      const rotationProps = { 
        x, y, angle, rotationFactor,
        counterRotationStyles: {
          transform: `rotate(${-angle}rad)`,
        },
      };
      
      return (
        <Fragment key={index}>
          <WeatherClockNode
            rotation={rotationProps}
            weatherData={hourlyWeatherData}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) rotate(${angle}rad)`,
            }}
            hour12={index == 0 ? 12 : index} // get rid of this shortly
          />
        </Fragment>
      );
    });

  // console.log({ hourlyForecastNodesNext });

  // const hourlyForecastNodes = Array.from({ length: 12 }).map((_, index) => {
  //   // styling and rotation and location constants
  // });

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
            style={
              {
                // position: "absolute",
                // width: `${clockSize / 2}px`,
                // height: `${clockSize / 2}px`,
              }
            }
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
