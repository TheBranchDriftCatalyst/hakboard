import { DateTime } from "luxon";
import { useState } from "react";
import ResponsiveTypography from "@/components/ui/typography";
import { useInterval } from "@/hooks/useInterval";
import { useConfig } from "@/lib/widget-config";

const now = (dateFormat: string) => {
  const dt = DateTime.local();
  return {
    hour: dt.toFormat("hh"),
    minute: dt.toFormat("mm"),
    second: dt.toFormat("ss"),
    ampm: dt.toFormat("a"),
    date: dt.toFormat(dateFormat),
  };
};

export const TimeWidget = () => {
  const { dateFormat } = useConfig({
    dateFormat: { type: "string", default: "DDDD", label: "Date format" },
  } as const);

  const [time, setTime] = useState(() => now(dateFormat));
  useInterval(() => setTime(now(dateFormat)), 1000);

  return (
    <div className="h-full w-full text-primary">
      <div className="flex grow flow-row justify-center">
        <ResponsiveTypography size="h2">
          {time.hour}:{time.minute}
        </ResponsiveTypography>
        <span className="flex flex-col justify-center">
          <ResponsiveTypography size="xs">{time.second}</ResponsiveTypography>
          <ResponsiveTypography size="xs">{time.ampm}</ResponsiveTypography>
        </span>
      </div>
      <ResponsiveTypography className="flex text-s justify-center align-top">
        {time.date}
      </ResponsiveTypography>
    </div>
  );
};

TimeWidget.defaultLayout = { w: 14, h: 5 };

export default TimeWidget;
