"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
// import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import {NewsWidget} from "@/widgets/news";
// import GridLayout from 'react-grid-layout';
import GridLayout, {Layout, Responsive, WidthProvider} from "react-grid-layout";
import { Toaster } from "@/components/ui/toaster";

import {Leva} from "leva";
import { Card } from "@/components/ui/card";
import { useLayoutEffect, useState } from "react";
import { set } from "lodash";

const ResponsiveGridLayout = WidthProvider(Responsive);


const defaultLayout: Layout[]  = [
  { i: "time_widget", x: 0, y: 0, w: 2, h: 3 },
  { i: "weather_widget", x: 1, y: 0, w: 1.25, h: 6 },
  { i: "test_widget", x: 1, y: 0, w: 1.25, h: 1 },
];

export default function Home() {
  const initLayout = localStorage.getItem('layout') || JSON.stringify(defaultLayout);
  console.log('initLayout', initLayout);
  const [layout, setLayout] = useState<Layout[]>(JSON.parse(initLayout));

  useLayoutEffect(() => {
    if (initLayout) {
      console.log('loading layout from local storage', JSON.parse(initLayout));
      setLayout(JSON.parse(initLayout));
    }
  }, [])

    
  return (
    <main>
      <Leva />
      <GridLayout
        // className="layout"
        // onDragStart={(e) => console.log('drag start', e)}
        containerPadding={[10, 10]}
        onLayoutChange={(layout) => {
          console.log('layout change - saving', layout);
          localStorage.setItem('layout', JSON.stringify(layout));
        }}
        layout={layout}
        cols={100}
        rowHeight={10}
        width={1920}
        resizeHandles={['s', 'e', 'se']}
      >
          <TimeWidget key="time_widget"/>
          <WeatherWidget key="weather_widget"/>
          <Card key="test_widget">
            Pandas are pretty sweet
          </Card>
        {/*<NewsWidget key={"news_widget"}/>*/}
      </GridLayout>
      {/*</ResponsiveGridLayout>*/}
      <Background/>
      <Toaster />
    </main>
  );
}

