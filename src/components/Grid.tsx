"use client";

import Debug from "debug";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Responsive as ResponsiveType } from "react-grid-layout";

import { defaultGridSizes as weatherWidgetSize } from "@/widgets/weather";

const defaultLayout: Layout[] = [
  { w: 14, h: 5, x: 0, y: 0, i: "time_widget" },
  {
    ...weatherWidgetSize,
    x: 3,
    y: 5,
    i: "weather_widget",
  },
  { w: 11, h: 2, x: 45, y: 0, i: "test_widget" },
  { w: 20, h: 5, x: 80, y: 2, i: "news_widget" },
];

const getFromLocalStorage = (): Layout[] => {
  let initLayout = null;
  if (global.localStorage) {
    initLayout = localStorage.getItem("layout");
    initLayout = initLayout ? JSON.parse(initLayout) : null;
  }
  if (!initLayout) {
    initLayout = defaultLayout;
  }
  return initLayout;
};

interface DraggableGridLayoutProps {
  dashboard: string;
  children: ReactNode;
}

export const DraggableGridLayout = ({ dashboard, children }: DraggableGridLayoutProps) => {
  const debug = Debug("grid-layout");
  const [layout, setLayout] = useState<Layout[]>(getFromLocalStorage());
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), [layout]);

  useEffect(() => {
    const savedLayout = localStorage.getItem(`layout:${dashboard}`) || null;
    if (savedLayout) {
      debug("loading layout from local storage", JSON.parse(savedLayout));
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  return (
    <ResponsiveGridLayout
      containerPadding={[5, 5]}
      onLayoutChange={(layout) => {
        debug("Saving layout to local storage", layout);
        // could debounce this perhaps
        localStorage.setItem(`layout:${dashboard}`, JSON.stringify(layout));
      }}
      draggableCancel="button a .no-drag"
      rowHeight={10}
      layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 100 }}
      // resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
      // resizeHandle={(props: any, ref: any) => {
      //   console.log("resizeHandle", {props, ref});
      //   return (
      //     <Resizable {...props} handle={<MyHandle />} />
      //   )
      // }}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

export default DraggableGridLayout;
