"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
// import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import {NewsWidget} from "@/widgets/news";
// import GridLayout from 'react-grid-layout';
import GridLayout, {Responsive, WidthProvider} from "react-grid-layout";
import { Toaster } from "@/components/ui/toaster";

const ResponsiveGridLayout = WidthProvider(Responsive);



export default function Home() {

  // TODO: in order to get this working properly we need to define the grid dimensions a bit
  const layout = [
      { i: "time_widget", x: 0, y: 0, w: 1, h: 2 },
      { i: "weather_widget", x: 1, y: 0, w: 3, h: 2 },
      // { i: "c", x: 4, y: 0, w: 1, h: 2 }
    ];

  return (
    <main>
      {/*<ResponsiveGridLayout className="p-2 space-x-2 space-y-2"*/}
      {/*                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}*/}
      {/*                      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}*/}
      {/*                      layouts={{lg: layout, md: layout, sm: layout, xs: layout, xxs: layout}}*/}
      {/*>*/}
      <GridLayout
        // className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        ref={el => console.log(el)}
      >
        <div key="time_widget">
          <TimeWidget />
        </div>
        
        <div key="weather_widget">
          <WeatherWidget />
        </div>
        {/*<NewsWidget key={"news_widget"}/>*/}
      </GridLayout>
      {/*</ResponsiveGridLayout>*/}
      <Background/>
      <Toaster />
    </main>
  );
}

