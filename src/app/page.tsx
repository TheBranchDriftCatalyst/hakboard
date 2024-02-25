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
import { ClassAttributes, ForwardRefRenderFunction, Fragment, HTMLAttributes, JSX, ReactComponentElement, forwardRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { set } from "lodash";
import Debug from "debug";
import DraggableGridLayout from "@/components/Grid";
import { useSearchParams } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast";
import { SheetProvider, SheetTrigger } from "@/components/ui/sheet";
import { WidgetPropsProvider, useControls } from "@/components/sheets/WidgetControlSheet";

// const MyComponent = () => {
//   const openSheet = useSheet();

//   return (
//     <button onClick={() => openSheet(MyContentComponent)}>Open Sheet</button>
//   );
// };

const dashboards = {
  default: [
    <TimeWidget key="time_widget" />,
    <WeatherWidget key="weather_widget" />,
    <Card key="test_widget">Pandas are pretty sweet</Card>,
    <NewsWidget key={"news_widget"}/>,
  ],
  test: [
    <Card key="test_widget">Pandas are pretty sweet</Card>,
  ]
}

export default function Home() {
  const debug = Debug("home");

  const searchParams = useSearchParams()
 
  let dashName = searchParams.get('dashboard');
  if (!dashName) {
    dashName = 'default';
    debug("No dashboard name found, using default");
  }

  // const openSheet = useSheet();

  // useEffect(() => {
  //   setTimeout(() => {
  //     openSheet(MyContentComponent)
  //   }, 2000)
  // })

  return (
    <main>
      <QueryClientProvider client={new QueryClient()}>
        {/* Note: we need this outside of SheetProvider because the WidgetControll sheet is placed here */}
        <WidgetPropsProvider> 
          <SheetProvider>
            <DraggableGridLayout dashboard={dashName}>
              {dashboards[dashName as keyof typeof dashboards]}
            </DraggableGridLayout>
            <Background />
            <Toaster />
          </SheetProvider>
        </WidgetPropsProvider>
      </QueryClientProvider>
    </main>
  );
}
