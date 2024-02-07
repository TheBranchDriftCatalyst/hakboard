"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
// import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import {NewsWidget} from "@/widgets/news";
// import GridLayout from 'react-grid-layout';
import GridLayout, {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {

  const layout = [
      { i: "time_widget", x: 0, y: 0, w: 1, h: 2, static: true },
      { i: "weather_widget", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
      // { i: "c", x: 4, y: 0, w: 1, h: 2 }
    ];

  return (
    <main>
      <ResponsiveGridLayout className="p-2 space-x-2 space-y-2"
                            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                            layouts={{lg: layout, md: layout, sm: layout, xs: layout, xxs: layout}}
      >
        <TimeWidget key="time_widget"/>
        <WeatherWidget key="weather_widget"/>
        {/*<NewsWidget key={"news_widget"}/>*/}
      </ResponsiveGridLayout>
      <Background/>
    </main>
  );
}
