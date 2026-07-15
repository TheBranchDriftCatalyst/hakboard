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
  sampleInitial?: Record<string, unknown>;
  // Grid layout defaults (width in cols out of 100, height in rows of 10px).
  // Sized generously so widget content isn't cramped on first load — user
  // can shrink via drag-resize.
  defaultLayout: { w: number; h: number };
}

export const widgetCatalog: Record<string, WidgetSpec> = {
  time: {
    key: "time",
    displayName: "Time",
    Component: lazy(() => import("./time")),
    defaultLayout: { w: 26, h: 14 },
  },
  weather: {
    key: "weather",
    displayName: "Weather",
    Component: lazy(() => import("./weather")),
    sampleInitial: { city: "Denver", metricRotationInterval: 30 },
    defaultLayout: { w: 30, h: 40 },
  },
  news: {
    key: "news",
    displayName: "News",
    Component: lazy(() => import("./news")),
    defaultLayout: { w: 30, h: 24 },
  },
  text: {
    key: "text",
    displayName: "Text",
    Component: lazy(() => import("./text")),
    sampleInitial: { text: "Sample text" },
    defaultLayout: { w: 20, h: 10 },
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
