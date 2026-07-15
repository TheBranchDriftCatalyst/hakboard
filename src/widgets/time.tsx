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

  // Fluid sizing keyed off container width, min-clamped so isolation
  // renders don't collapse at first paint.
  const { width } = useWidgetWidth();
  const w = Math.max(width, 220);
  const timePx = Math.max(48, Math.min(w * 0.22, 260));
  const subPx = Math.max(12, Math.min(w * 0.05, 44));
  const datePx = Math.max(10, Math.min(w * 0.028, 18));

  const hh = now.toFormat(hour24 ? "HH" : "hh");
  const mm = now.toFormat("mm");
  const ss = now.toFormat("ss");
  const ampm = now.toFormat("a");

  const presetKey = (dateFormat in DATE_FORMATS ? dateFormat : "FULL") as DateFormatKey;
  const dateStr = now.toLocaleString(DATE_FORMATS[presetKey]);

  const minuteProgress = (now.second / 60) * 100;

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center gap-5 select-none px-6"
      data-testid="time-widget"
    >
      {/* Clock — mono, tabular, dimmed colon separates HH from MM */}
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono tabular-nums font-extralight text-primary leading-none tracking-tight"
          style={{ fontSize: timePx }}
          data-testid="time-clock"
        >
          {hh}
          <span className="text-primary/25">:</span>
          {mm}
        </span>
        {(showSeconds || !hour24) && (
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

      {/* Second-hand hairline — progress bar of the current minute */}
      <div className="w-full max-w-md h-px bg-divider relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary/60 transition-[width] duration-1000 ease-linear"
          style={{ width: `${minuteProgress}%` }}
        />
      </div>

      {showDate && (
        <div
          className="font-mono uppercase text-muted-foreground text-center"
          style={{ fontSize: datePx, letterSpacing: "0.3em" }}
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
