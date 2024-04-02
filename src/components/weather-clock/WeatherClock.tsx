import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
  OpenWeatherDTOInterface,
  OpenWeatherDataMetric,
} from "./OpenWeatherDTO";
import { SizeMe } from "react-sizeme";
import { Cloud } from "lucide-react";
import Debug from "debug";
import WeatherClockNode from "./WeatherClockNode";
import { DateTime } from "luxon";
import { chain } from "lodash";
import { useSheet } from "../ui/sheet";
import WidgetControls from "../sheets/WidgetControlSheet";

const debug = Debug("weather:clock");

export interface SizerProps {
  size: { width: number; height: number };
}

export interface WeatherClockProps extends SizerProps {
  openWeatherData?: OpenWeatherDTOInterface;
  currentMetric?: OpenWeatherDataMetric;
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
  currentMetric,
  size: { width, height },
}: WeatherClockProps) => {
  const clockSize = Math.max(Math.min(width, height) * .75, 10);
  const radius = clockSize / 2;

  const hourlyForecastNodes = openWeatherData?.hourly
    ?.slice()
    .slice(0, 12) // Take the first 12 elements representing the next 12 hours of forecasts
    .sort((a, b) => (a.dt.hour % 12) - (b.dt.hour % 12)) // Sort by hour, such that index 0 is 12 o-clock not current hour
    .map((hourlyWeatherData, index) => {
      const rotationFactor = -((90 * Math.PI) / 180); // rotate counterclockwise 90 degrees, otherwise we start at 3 o-clock, 0=24|12
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
            currentMetric={currentMetric}
            weatherData={hourlyWeatherData}
            isSunset={openWeatherData?.current?.sunsettermter}
            isSunrise={openWeatherData?.current?.sunrise}
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


  const currentConditions = openWeatherData?.current?.weather[0]?.id;
  const primaryDescription = openWeatherData?.current?.weather[0]?.description;

  return (
    <div
      className="flex justify-center items-center w-full h-full"
      style={{
        position: "relative",
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
          }}
        >
          <div>
            <div className="text-primary">
              {currentMetric}  
            </div>
            <div className="">{primaryDescription}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
