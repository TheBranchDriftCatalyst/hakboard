import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DraggableGridLayout, { type WidgetInstance } from "@/components/Grid";
import { WidgetHost } from "@/widgets/widget-wrapper";
import { WidgetConfigProvider } from "@/lib/widget-config";
import { WidgetControls } from "@/components/sheets/WidgetControlSheet";
import { useSearchParam } from "@/hooks/useSearchParam";
import { usePathname } from "@/hooks/usePathname";
import { instanceFromSpec, widgetCatalog, type WidgetSpec } from "@/widgets/catalog";

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

// Chronometer-style gear: hairline square button, muted at rest, primary on hover.
const ControlsSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open widget controls"
          className="fixed bottom-4 right-4 z-40 grid place-items-center h-9 w-9 rounded-sm border border-border bg-surface-1/80 backdrop-blur-sm text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
        >
          <Settings className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent className="border-l border-border bg-surface-1">
        <WidgetControls />
      </SheetContent>
    </Sheet>
  );
};

// Discreet nav strip surfaced on non-dashboard routes so you can escape back.
const BackToDashboard = ({ label = "Dashboard" }: { label?: string }) => (
  <a
    href="/"
    className="fixed top-4 left-4 z-40 inline-flex items-center gap-2 font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground hover:text-primary transition-colors"
  >
    <ArrowLeft className="h-3 w-3" />
    {label}
  </a>
);

// ?widget=<key> renders one widget filling the viewport with the full app
// providers stack. Used for visual iteration + parameterized e2e tests.
const IsolatedWidget = ({ widgetKey }: { widgetKey: string }) => {
  const spec = widgetCatalog[widgetKey];
  if (!spec) {
    return (
      <div className="p-12 max-w-md">
        <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-destructive mb-2">
          Unknown widget
        </div>
        <div className="text-lg text-foreground">{widgetKey}</div>
        <div className="text-sm text-muted-foreground mt-2">
          Available: {Object.keys(widgetCatalog).join(", ")}
        </div>
      </div>
    );
  }
  return (
    <>
      <BackToDashboard />
      <div className="fixed inset-0 pt-14 pb-14 px-6" data-testid="widget-isolation-root">
        <WidgetHost
          instanceKey={spec.key}
          displayName={spec.displayName}
          initial={spec.sampleInitial}
          Component={spec.Component}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="fixed bottom-4 left-4 z-40 font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground">
        {spec.displayName}
      </div>
    </>
  );
};

// /catalog — every widget side-by-side. Layout: auto-fit grid, header strip,
// per-cell hairline chrome. Widgets share instanceKey with their dashboard
// twins so config changes propagate.
const CatalogPage = () => {
  const specs = Object.values(widgetCatalog);
  return (
    <>
      <BackToDashboard />
      <div className="min-h-screen p-8 pt-16" data-testid="catalog-page">
        <header className="mb-8 flex items-baseline justify-between border-b border-border pb-4">
          <div className="flex items-baseline gap-4">
            <h1 className="font-mono uppercase tracking-[0.3em] text-[11px] text-muted-foreground">
              Catalog
            </h1>
            <span className="font-mono tabular-nums text-[11px] text-muted-foreground/50">
              {specs.length.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground/60">
            Live · configurable
          </span>
        </header>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}
        >
          {specs.map((spec: WidgetSpec) => (
            <section
              key={spec.key}
              data-testid={`catalog-cell-${spec.key}`}
              className="flex flex-col gap-2"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground">
                  {spec.displayName}
                </span>
                <a
                  href={`/?widget=${spec.key}`}
                  className="font-mono uppercase tracking-[0.3em] text-[9px] text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  Isolate ↗
                </a>
              </div>
              <div className="h-[340px]">
                <WidgetHost
                  instanceKey={spec.key}
                  displayName={spec.displayName}
                  initial={spec.sampleInitial}
                  Component={spec.Component}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default function App() {
  const pathname = usePathname();
  const isolatedWidget = useSearchParam("widget");
  const dashName = (useSearchParam("dashboard") ?? "default") as keyof typeof dashboards;

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <WidgetConfigProvider>
          {pathname === "/catalog" ? (
            <CatalogPage />
          ) : isolatedWidget ? (
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
