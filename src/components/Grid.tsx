import Debug from "debug";
import { ReactNode, useEffect, useState } from "react";
import {
  Responsive,
  useContainerWidth,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";

import { defaultGridSizes as weatherWidgetSize } from "@/widgets/weather";

const defaultLayout: LayoutItem[] = [
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

const loadLayout = (dashboard: string): LayoutItem[] => {
  if (typeof window === "undefined") return defaultLayout;
  const saved = localStorage.getItem(`layout:${dashboard}`);
  return saved ? (JSON.parse(saved) as LayoutItem[]) : defaultLayout;
};

interface DraggableGridLayoutProps {
  dashboard: string;
  children: ReactNode;
}

const debug = Debug("grid-layout");

export const DraggableGridLayout = ({ dashboard, children }: DraggableGridLayoutProps) => {
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout(dashboard));
  const { width, containerRef, mounted } = useContainerWidth();

  useEffect(() => {
    setLayout(loadLayout(dashboard));
  }, [dashboard]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {mounted && (
        <Responsive
          width={width}
          containerPadding={[5, 5]}
          onLayoutChange={(next: Layout) => {
            debug("Saving layout to local storage", next);
            localStorage.setItem(`layout:${dashboard}`, JSON.stringify(next));
          }}
          dragConfig={{ cancel: "button a .no-drag" }}
          rowHeight={10}
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 100 }}
        >
          {children}
        </Responsive>
      )}
    </div>
  );
};

export default DraggableGridLayout;
