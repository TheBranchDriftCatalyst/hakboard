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
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
// import { Resizable } from "react-resizable";
import { withSize } from 'react-sizeme'

import { Toaster } from "@/components/ui/toaster";

import { Leva } from "leva";
import { Card } from "@/components/ui/card";
import { ClassAttributes, ForwardRefRenderFunction, HTMLAttributes, JSX, ReactComponentElement, forwardRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { set } from "lodash";
import Debug from "debug";
import DraggableGridLayout from "@/components/Grid";

// const MyHandle = forwardRef((props, ref) => {
//   const {handleAxis, ...restProps} = props;
//   return <div ref={ref} className={`foo handle-${handleAxis}`} {...restProps} />;
// });


export default function Home() {
  const debug = Debug("home");

  return (
    <main>
      <QueryClientProvider client={new QueryClient()}>
        <Leva />
        <DraggableGridLayout>
          <TimeWidget key="time_widget" />
          <WeatherWidget key="weather_widget" />
          <Card key="test_widget">Pandas are pretty sweet</Card>
          <NewsWidget key={"news_widget"}/>
        </DraggableGridLayout>
        {/*</ResponsiveGridLayout>*/}
        <Background />
        <Toaster />
      </QueryClientProvider>
    </main>
  );
}
