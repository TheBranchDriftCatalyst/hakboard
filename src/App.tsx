import Background from "@/widgets/background";
import WeatherWidget from "@/widgets/weather";
import TimeWidget from "@/widgets/time";
import NewsWidget from "@/widgets/news";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Card } from "@/components/ui/card";
import DraggableGridLayout from "@/components/Grid";
import { useSearchParam } from "@/hooks/useSearchParam";
import { SheetProvider } from "@/components/ui/sheet";
import { WidgetPropsProvider } from "@/components/sheets/WidgetControlSheet";

const dashboards = {
  default: [
    <TimeWidget key="time_widget" />,
    <WeatherWidget key="weather_widget" city="Denver" metricRotationInterval={30} />,
    <Card key="test_widget">Pandas are pretty sweet</Card>,
    <NewsWidget key="news_widget" />,
  ],
  test: [<Card key="test_widget">Pandas are pretty sweet</Card>],
};

const queryClient = new QueryClient();

export default function App() {
  const dashName = (useSearchParam("dashboard") ?? "default") as keyof typeof dashboards;

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WidgetPropsProvider>
          <SheetProvider>
            <DraggableGridLayout dashboard={dashName}>
              {dashboards[dashName]}
            </DraggableGridLayout>
            <Background />
            <Toaster />
          </SheetProvider>
        </WidgetPropsProvider>
      </QueryClientProvider>
    </main>
  );
}
