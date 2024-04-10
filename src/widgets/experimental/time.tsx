"use client";
import ResponsiveTypography from "@/components/ui/typography";
import { DateTime } from "luxon";
import { useLayoutEffect, useState } from "react";

const now = (dateFormat = "DDDD") => {
  const datetime = DateTime.local();
  return {
    hour: datetime.toFormat("hh"),
    minute: datetime.toFormat("mm"),
    second: datetime.toFormat("ss"),
    ampm: datetime.toFormat("a"),
    date: datetime.toFormat(dateFormat),
  };
};

interface TimeWidgetProps {
  dateFormat?: string;
}

const defaultProps: TimeWidgetProps = {
  dateFormat: "DDDD",
};

const TimeWidget = ({ dateFormat }: TimeWidgetProps = defaultProps) => {
  const [{ date, hour, minute, second, ampm }, setTime] = useState(
    now(dateFormat),
  );

  useLayoutEffect(() => {
    const interval = setInterval(() => setTime(now(dateFormat)), 1000);
    return () => clearInterval(interval);
  }, [dateFormat]);

  return (
    <div className="h-full w-full text-primary">
      <div className={"flex grow flow-row justify-center"}>
        <ResponsiveTypography size="h2">
          {hour}:{minute}
        </ResponsiveTypography>
        <span className={"flex flex-col justify-center"}>
          <ResponsiveTypography size="xs">{second}</ResponsiveTypography>
          <ResponsiveTypography size="xs">{ampm}</ResponsiveTypography>
        </span>
      </div>
      <ResponsiveTypography className={"flex text-s justify-center align-top"}>
        {date}
      </ResponsiveTypography>
    </div>
  );
};

export default TimeWidget;
