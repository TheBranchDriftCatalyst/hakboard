import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { WidgetInstance } from "@/components/Grid";

// One source of truth for every dashboard widget: metadata + a lazy import.
// Dashboards derive their WidgetInstance[] from this map, and the ?widget=<key>
// isolation route resolves against it. Add a widget here and it's available
// everywhere — no more parallel lists.

export interface WidgetSpec {
  key: string;
  displayName: string;
  Component: LazyExoticComponent<ComponentType>;
  // Sensible seed values shown when a widget appears on a dashboard for the
  // first time. User edits made via the control sheet override these and
  // persist to localStorage.
  sampleInitial?: Record<string, unknown>;
  // Grid layout defaults (width in cols, height in rows). Copied into
  // WidgetInstance.layoutOverrides when instantiated — the Grid renders
  // before lazy chunks resolve, so it can't read a static property off the
  // Component reference.
  defaultLayout: { w: number; h: number };
}

export const widgetCatalog: Record<string, WidgetSpec> = {
  time: {
    key: "time",
    displayName: "Time",
    Component: lazy(() => import("./time")),
    defaultLayout: { w: 14, h: 5 },
  },
  weather: {
    key: "weather",
    displayName: "Weather",
    Component: lazy(() => import("./weather")),
    sampleInitial: { city: "Denver", metricRotationInterval: 30 },
    defaultLayout: { w: 20, h: 20 },
  },
  news: {
    key: "news",
    displayName: "News",
    Component: lazy(() => import("./news")),
    defaultLayout: { w: 20, h: 5 },
  },
  text: {
    key: "text",
    displayName: "Text",
    Component: lazy(() => import("./text")),
    sampleInitial: { text: "Sample text" },
    defaultLayout: { w: 10, h: 3 },
  },
};

export const instanceFromSpec = (
  spec: WidgetSpec,
  overrides?: Partial<WidgetInstance>,
): WidgetInstance => ({
  key: spec.key,
  displayName: spec.displayName,
  Component: spec.Component,
  initial: spec.sampleInitial,
  layoutOverrides: spec.defaultLayout,
  ...overrides,
});
