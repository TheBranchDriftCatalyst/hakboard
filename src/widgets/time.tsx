"use client";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import WidgetWrapper from "@/widgets/widget-wrapper";

const now = (dateFormat = 'DDDD') => {
  // probably can be optimized but who cares for now
  const datetime = DateTime.local();
  return {
    hour: datetime.toFormat('hh'),
    minute: datetime.toFormat('mm'),
    second: datetime.toFormat('ss'),
    ampm: datetime.toFormat("a"),
    date: datetime.toFormat(dateFormat)
  }
};

const TimeWidget = () => {
  const [{
    date,
    hour,
    minute,
    second,
    ampm
  }, setTime] = useState(now());

  useEffect(() => {
    const interval = setInterval(() => setTime(now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={"flex flow-row justify-center"}>
        <span className="text-5xl">{hour}:{minute}</span>
        <span className={"flex flex-col "}>
              <div>{second}</div>
              <div>{ampm}</div>
            </span>
      </div>
      <div className={"flex text-s justify-center"}>{date}</div>
    </div>
  )
}

export default WidgetWrapper(TimeWidget);
