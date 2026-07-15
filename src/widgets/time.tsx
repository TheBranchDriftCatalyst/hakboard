import { DateTime } from "luxon";
import { useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { useConfig } from "@/lib/widget-config";
import { useWidgetWidth } from "@/widgets/widget-wrapper";

const DATE_FORMATS = {
  SHORT: DateTime.DATE_SHORT,
  MED: DateTime.DATE_MED,
  FULL: DateTime.DATE_FULL,
  HUGE: DateTime.DATE_HUGE,
} as const;

type DateFormatKey = keyof typeof DATE_FORMATS;

export const TimeWidget = () => {
  const { hour24, showSeconds, showDate, dateFormat } = useConfig({
    hour24: { type: "boolean", default: false, label: "24-hour" },
    showSeconds: { type: "boolean", default: true, label: "Show seconds" },
    showDate: { type: "boolean", default: true, label: "Show date" },
    dateFormat: {
      type: "enum",
      default: "FULL",
      options: ["SHORT", "MED", "FULL", "HUGE"] as const,
      label: "Date format",
    },
  } as const);

  const [now, setNow] = useState(() => DateTime.local());
  useInterval(() => setNow(DateTime.local()), 1000);

  // Sizing based on the widget's own measured width. Font size scales
  // proportionally, with a hard floor so it stays readable at any container
  // size the grid may squish it to.
  const { width } = useWidgetWidth();
  const w = Math.max(width, 200);

  // Adaptive layout: at very narrow widths, drop the seconds/AMPM stack and
  // the second-hand line to prevent overflow.
  const compact = w < 260;
  const tiny = w < 200;

  const timePx = Math.max(28, Math.min(w * 0.22, 240));
  const subPx = Math.max(11, Math.min(w * 0.05, 40));
  const datePx = Math.max(9, Math.min(w * 0.026, 16));

  const hh = now.toFormat(hour24 ? "HH" : "hh");
  const mm = now.toFormat("mm");
  const ss = now.toFormat("ss");
  const ampm = now.toFormat("a");

  const presetKey = (dateFormat in DATE_FORMATS ? dateFormat : "FULL") as DateFormatKey;
  const dateStr = now.toLocaleString(DATE_FORMATS[presetKey]);

  const minuteProgress = (now.second / 60) * 100;

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center gap-3 select-none overflow-hidden px-3"
      data-testid="time-widget"
    >
      <div className="flex items-baseline gap-2 min-w-0 max-w-full">
        <span
          className="font-mono tabular-nums font-extralight text-primary leading-none tracking-tight whitespace-nowrap"
          style={{ fontSize: timePx }}
          data-testid="time-clock"
        >
          {hh}
          <span className="text-primary/25">:</span>
          {mm}
        </span>
        {!compact && (showSeconds || !hour24) && (
          <div
            className="flex flex-col items-start justify-center leading-none"
            style={{ gap: subPx * 0.2 }}
          >
            {showSeconds && (
              <span
                className="font-mono tabular-nums text-secondary/90 font-light"
                style={{ fontSize: subPx }}
                data-testid="time-seconds"
              >
                {ss}
              </span>
            )}
            {!hour24 && (
              <span
                className="font-mono uppercase tracking-[0.3em] text-muted-foreground"
                style={{ fontSize: subPx * 0.55 }}
                data-testid="time-ampm"
              >
                {ampm}
              </span>
            )}
          </div>
        )}
      </div>

      {!tiny && (
        <div className="w-full max-w-md h-px bg-divider relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary/60 transition-[width] duration-1000 ease-linear"
            style={{ width: `${minuteProgress}%` }}
          />
        </div>
      )}

      {showDate && !tiny && (
        <div
          className="font-mono uppercase text-muted-foreground text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
          style={{ fontSize: datePx, letterSpacing: "0.3em" }}
          data-testid="time-date"
        >
          {dateStr}
        </div>
      )}
    </div>
  );
};

TimeWidget.defaultLayout = { w: 26, h: 14 };

export default TimeWidget;
