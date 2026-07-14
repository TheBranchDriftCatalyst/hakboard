import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DraggableGridLayout, { type WidgetInstance } from "@/components/Grid";
import { WidgetConfigProvider } from "@/lib/widget-config";
import { WidgetControls } from "@/components/sheets/WidgetControlSheet";
import { useSearchParam } from "@/hooks/useSearchParam";

import Background from "@/widgets/background";
import TimeWidget from "@/widgets/time";
import WeatherWidget from "@/widgets/weather";
import NewsWidget from "@/widgets/news";

const dashboards: Record<string, WidgetInstance[]> = {
  default: [
    { key: "time", Component: TimeWidget, displayName: "Time" },
    {
      key: "weather",
      Component: WeatherWidget,
      displayName: "Weather",
      initial: { city: "Denver", metricRotationInterval: 30 },
    },
    { key: "news", Component: NewsWidget, displayName: "News" },
  ],
  test: [{ key: "time", Component: TimeWidget, displayName: "Time" }],
};

const queryClient = new QueryClient();

export default function App() {
  const dashName = (useSearchParam("dashboard") ?? "default") as keyof typeof dashboards;
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WidgetConfigProvider>
          <DraggableGridLayout dashboard={dashName} instances={dashboards[dashName]} />
          <Background />
          <Sheet open={controlsOpen} onOpenChange={setControlsOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open widget controls"
                className="fixed bottom-4 right-4 z-40 rounded-full bg-primary text-primary-foreground p-3 shadow-lg hover:opacity-90"
              >
                <Settings className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <WidgetControls />
            </SheetContent>
          </Sheet>
          <Toaster />
        </WidgetConfigProvider>
      </QueryClientProvider>
    </main>
  );
}
