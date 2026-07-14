import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DraggableGridLayout, { type WidgetInstance } from "@/components/Grid";
import { WidgetHost } from "@/widgets/widget-wrapper";
import { WidgetConfigProvider } from "@/lib/widget-config";
import { WidgetControls } from "@/components/sheets/WidgetControlSheet";
import { useSearchParam } from "@/hooks/useSearchParam";
import { instanceFromSpec, widgetCatalog } from "@/widgets/catalog";

import Background from "@/widgets/background";

const dashboards: Record<string, WidgetInstance[]> = {
  default: [
    instanceFromSpec(widgetCatalog.time),
    instanceFromSpec(widgetCatalog.weather),
    instanceFromSpec(widgetCatalog.news),
  ],
  test: [instanceFromSpec(widgetCatalog.time)],
};

const queryClient = new QueryClient();

const ControlsSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
  );
};

// Isolation route: ?widget=<key> renders one widget filling the viewport with
// full app providers (query, config, sheet). Used for per-widget visual
// iteration and parameterized e2e tests. If the key is unknown, falls through
// to a clear error state instead of the dashboard.
const IsolatedWidget = ({ widgetKey }: { widgetKey: string }) => {
  const spec = widgetCatalog[widgetKey];
  if (!spec) {
    return (
      <div className="p-8 text-foreground">
        <h1 className="text-2xl">Unknown widget: {widgetKey}</h1>
        <p className="text-muted-foreground pt-2">
          Available: {Object.keys(widgetCatalog).join(", ")}
        </p>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 p-4" data-testid="widget-isolation-root">
      <WidgetHost
        instanceKey={spec.key}
        displayName={spec.displayName}
        initial={spec.sampleInitial}
        Component={spec.Component}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default function App() {
  const isolatedWidget = useSearchParam("widget");
  const dashName = (useSearchParam("dashboard") ?? "default") as keyof typeof dashboards;

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WidgetConfigProvider>
          {isolatedWidget ? (
            <IsolatedWidget widgetKey={isolatedWidget} />
          ) : (
            <>
              <DraggableGridLayout dashboard={dashName} instances={dashboards[dashName]} />
              <Background />
            </>
          )}
          <ControlsSheet />
          <Toaster />
        </WidgetConfigProvider>
      </QueryClientProvider>
    </main>
  );
}
