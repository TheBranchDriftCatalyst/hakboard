"use client";
import Background from "@/widgets/background";
import Text from "@/widgets/text";
import { Leva } from "leva";
import WeatherWidget from "@/widgets/weather";
import {TimeWidget} from "@/widgets/time";
import {NewsWidget} from "@/widgets/news";
import GridLayout from 'react-grid-layout';



export default function Home() {
  return (
    <main className="p-5">
      {/*<GridLayout className="layout" cols={12} rowHeight={30} width={1200}>*/}
      <TimeWidget key="time_widget"/>
      <WeatherWidget key="weather_widget"/>
      <NewsWidget key={"news_widget"}/>
      {/*</GridLayout>*/}
      <Background />
    </main>
  );
}
