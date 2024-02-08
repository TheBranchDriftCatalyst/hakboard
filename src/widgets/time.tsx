"use client";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import WidgetWrapper from "@/widgets/widget-wrapper";

const now = (dateFormat = 'DDDD') => {
  const datetime = DateTime.local();
  return {
    hour: datetime.toFormat('hh'),
    minute: datetime.toFormat('mm'),
    second: datetime.toFormat('ss'),
    ampm: datetime.toFormat("a"),
    date: datetime.toFormat(dateFormat)
  }
};

interface TimeWidgetProps {
  dateFormat?: string;
}

const defaultProps: TimeWidgetProps = {
  dateFormat: "DDDD"
}

const TimeWidget = ({dateFormat}: TimeWidgetProps = defaultProps) => {
  const [{
    date,
    hour,
    minute,
    second,
    ampm
  }, setTime] = useState(now(dateFormat));

  useEffect(() => {
    const interval = setInterval(() => setTime(now(dateFormat)), 1000);
    return () => clearInterval(interval);
  }, [dateFormat]);

  return (
    <div suppressHydrationWarning={true}>
      <div className={"flex flow-row justify-center"}>
        <span className="text-5xl">{hour}:{minute}</span>
        <span className={"flex flex-col"}>
              <div>{second}</div>
              <div>{ampm}</div>
            </span>
      </div>
      <div className={"flex text-s justify-center"}>{date}</div>
    </div>
  )
}

// Define defaultProps outside the component
// TimeWidget.defaultProps = {
//   dateFormat: "DDDD"
// };

export default WidgetWrapper(TimeWidget, defaultProps);
