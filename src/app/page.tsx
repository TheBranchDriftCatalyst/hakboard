"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
// import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import { NewsWidget } from "@/widgets/news";
// import GridLayout from 'react-grid-layout';
import GridLayout, {
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import { Toaster } from "@/components/ui/toaster";

import { Leva } from "leva";
import { Card } from "@/components/ui/card";
import { useLayoutEffect, useState } from "react";
import { set } from "lodash";
import Debug from "debug";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayout: Layout[] = [
  { w: 14, h: 5, x: 0, y: 0, i: "time_widget" },
  {
    w: 10,
    h: 12,
    x: 3,
    y: 5,
    i: "weather_widget",
  },
  { w: 11, h: 2, x: 45, y: 0, i: "test_widget" },
];

export default function Home() {
  const initLayout = JSON.stringify(defaultLayout);
  const debug = Debug("grid-layout");
  debug("initLayout", initLayout);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  useLayoutEffect(() => {
    if (initLayout) {
      debug("loading layout from local storage", JSON.parse(initLayout));
      setLayout(JSON.parse(initLayout));
    }
  }, []);

  return (
    <main>
      <Leva />
      <GridLayout
        containerPadding={[10, 10]}
        onLayoutChange={(layout) => {
          debug("Saving layout to local storage", layout);
          localStorage.setItem("layout", JSON.stringify(layout));
        }}
        draggableCancel="button"
        layout={layout}
        cols={100}
        rowHeight={10}
        width={1920}
        resizeHandles={["s", "e", "se"]}
      >
        <TimeWidget key="time_widget" />
        <WeatherWidget key="weather_widget" />
        <Card key="test_widget">Pandas are pretty sweet</Card>
        {/*<NewsWidget key={"news_widget"}/>*/}
      </GridLayout>
      {/*</ResponsiveGridLayout>*/}
      <Background />
      <Toaster />
    </main>
  );
}
