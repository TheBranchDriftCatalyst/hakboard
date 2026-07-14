import Debug from "debug";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Responsive,
  useContainerWidth,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";
import { WidgetHost } from "@/widgets/widget-wrapper";

const debug = Debug("grid-layout");

export interface WidgetInstance {
  key: string;
  displayName?: string;
  Component: ComponentType & { defaultLayout?: { w: number; h: number } };
  initial?: Record<string, unknown>;
  layoutOverrides?: Partial<Omit<LayoutItem, "i">>;
}

interface DraggableGridLayoutProps {
  dashboard: string;
  instances: WidgetInstance[];
}

const layoutStorageKey = (dashboard: string) => `layout:${dashboard}`;

const buildDefaultLayout = (instances: WidgetInstance[]): LayoutItem[] =>
  instances.map((inst, i) => ({
    i: inst.key,
    x: (i * 14) % 100,
    y: Math.floor(i / 7) * 5,
    w: inst.Component.defaultLayout?.w ?? 10,
    h: inst.Component.defaultLayout?.h ?? 5,
    ...inst.layoutOverrides,
  }));

const loadLayout = (dashboard: string, instances: WidgetInstance[]): LayoutItem[] => {
  const fallback = buildDefaultLayout(instances);
  if (typeof window === "undefined") return fallback;
  const saved = localStorage.getItem(layoutStorageKey(dashboard));
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved) as LayoutItem[];
    // Union of persisted layout and any new instances not yet persisted.
    const persistedKeys = new Set(parsed.map((item) => item.i));
    const additions = fallback.filter((item) => !persistedKeys.has(item.i));
    return [...parsed, ...additions];
  } catch {
    return fallback;
  }
};

export const DraggableGridLayout = ({ dashboard, instances }: DraggableGridLayoutProps) => {
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout(dashboard, instances));
  const { width, containerRef, mounted } = useContainerWidth();

  useEffect(() => {
    setLayout(loadLayout(dashboard, instances));
  }, [dashboard, instances]);

  const responsiveLayouts = useMemo(
    () => ({ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }),
    [layout],
  );

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {mounted && (
        <Responsive
          width={width}
          containerPadding={[5, 5]}
          onLayoutChange={(next: Layout) => {
            debug("Saving layout to local storage", next);
            localStorage.setItem(layoutStorageKey(dashboard), JSON.stringify(next));
          }}
          dragConfig={{ cancel: "button a .no-drag" }}
          rowHeight={10}
          layouts={responsiveLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 100 }}
        >
          {instances.map((inst) => (
            <WidgetHost
              key={inst.key}
              instanceKey={inst.key}
              displayName={inst.displayName}
              initial={inst.initial}
              Component={inst.Component}
            />
          ))}
        </Responsive>
      )}
    </div>
  );
};

export default DraggableGridLayout;
