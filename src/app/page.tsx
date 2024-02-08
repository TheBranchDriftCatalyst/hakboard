"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
// import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import NewsWidget from "@/widgets/news";
// import GridLayout from 'react-grid-layout';
import GridLayout, {
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";

import { Resizable } from "react-resizable";
import { withSize } from 'react-sizeme'

import { Toaster } from "@/components/ui/toaster";

import { Leva } from "leva";
import { Card } from "@/components/ui/card";
import { ForwardRefRenderFunction, ReactComponentElement, useLayoutEffect, useState } from "react";
import { set } from "lodash";
import Debug from "debug";

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
  { w: 20, h: 5, x: 80, y: 2, i: "news_widget" },
];

const MyHandle = (props) => {
  return <div ref={props.innerRef} className="foo" {...props} />;
};

export default function Home() {
  const debug = Debug("grid-layout");
  const savedLayout = localStorage.getItem("layout") || "null";
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  const ResponsiveGridLayout = WidthProvider(Responsive);
  // const ResponsiveGridLayout = withSize()(Responsive);
  // const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

  useLayoutEffect(() => {
    if (savedLayout) {
      debug("loading layout from local storage", JSON.parse(savedLayout));
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  return (
    <main>
      <Leva />
      <ResponsiveGridLayout
        containerPadding={[5, 5]}
        onLayoutChange={(layout) => {
          debug("Saving layout to local storage", layout);
          localStorage.setItem("layout", JSON.stringify(layout));
        }}
        draggableCancel="button a"
        rowHeight={10}
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 50 }}
        resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
        // resizeHandle={props => <Resizable handle={(handleAxis, ref) => <MyHandle innerRef={ref} className={`foo handle-${handleAxis}`} />} />}
      >
        <TimeWidget key="time_widget" />
        <WeatherWidget key="weather_widget" />
        <Card key="test_widget">Pandas are pretty sweet</Card>
        <NewsWidget key={"news_widget"}/>
      </ResponsiveGridLayout>
      {/*</ResponsiveGridLayout>*/}
      <Background />
      <Toaster />
    </main>
  );
}
