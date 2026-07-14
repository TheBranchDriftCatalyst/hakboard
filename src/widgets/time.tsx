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

  // Fluid pixel sizing keyed off the widget's actual container size.
  // Falls back to a small floor so isolation/first-render doesn't collapse to 0.
  const { width } = useWidgetWidth();
  const w = Math.max(width, 200);
  const timePx = Math.max(28, Math.min(w * 0.18, 240));
  const subPx = Math.max(12, Math.min(w * 0.055, 56));
  const datePx = Math.max(10, Math.min(w * 0.033, 22));

  const hh = now.toFormat(hour24 ? "HH" : "hh");
  const mm = now.toFormat("mm");
  const ss = now.toFormat("ss");
  const ampm = now.toFormat("a");

  const presetKey = (dateFormat in DATE_FORMATS ? dateFormat : "FULL") as DateFormatKey;
  const dateStr = now.toLocaleString(DATE_FORMATS[presetKey]);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-primary select-none"
      data-testid="time-widget"
    >
      <div className="flex items-baseline gap-3 tabular-nums font-light tracking-tight leading-none">
        <span style={{ fontSize: timePx, lineHeight: 1 }} data-testid="time-clock">
          {hh}
          <span className="opacity-60">:</span>
          {mm}
        </span>
        {(showSeconds || !hour24) && (
          <span
            className="flex flex-col items-start text-secondary tabular-nums leading-none"
            style={{ fontSize: subPx, gap: subPx * 0.15 }}
          >
            {showSeconds && <span data-testid="time-seconds">{ss}</span>}
            {!hour24 && <span data-testid="time-ampm">{ampm}</span>}
          </span>
        )}
      </div>
      {showDate && (
        <div
          className="text-muted-foreground uppercase tracking-widest"
          style={{ fontSize: datePx, paddingTop: datePx * 0.8 }}
          data-testid="time-date"
        >
          {dateStr}
        </div>
      )}
    </div>
  );
};

TimeWidget.defaultLayout = { w: 14, h: 5 };

export default TimeWidget;
