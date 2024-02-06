"use client";
import { DateTime } from "luxon";
import {useEffect, useState } from "react";
import {Card, CardContent} from "@/components/ui/card";

const now = () => {
  const datetime = DateTime.local();
  return {
      hour: datetime.toFormat('hh'),
      minute: datetime.toFormat('mm'),
      second: datetime.toFormat('ss'),
      meridiem: datetime.toFormat("a"),
      date: datetime.toFormat('DDDD')
    }
};

export const TimeWidget = () => {
  const [{date, hour, minute, second, meridiem}, setTime] = useState(now());

  useEffect(() => {
    const datetime = now();
    const interval = setInterval(() => setTime(now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={"w-64"}>
      <CardContent className={'flex flex-col'}>
        <div className={"flex flow-row justify-center"}>
            <span className="text-5xl">{hour}:{minute}</span>
            <span className={"flex flex-col "}>
              <div>{second}</div>
              <div>{meridiem}</div>
            </span>
        </div>
        <div className={"flex text-s justify-center"}>{date}</div>
    </CardContent>
   </Card>
  )
}
