import {
  createContext,
  forwardRef,
  Suspense,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Shell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InstanceProvider } from "@/lib/widget-config";

interface WidgetWidth {
  width: number;
  height: number;
}
const WidgetWidthContext = createContext<WidgetWidth | null>(null);

export const useWidgetWidth = (): WidgetWidth => {
  const ctx = useContext(WidgetWidthContext);
  if (!ctx) throw new Error("useWidgetWidth must be used inside a widget");
  return ctx;
};

const LoadingCardContent = () => (
  <CardContent className="w-full h-full">
    <Shell className="animate-spin" size={128} />
    <div>Loading...</div>
  </CardContent>
);

interface WidgetHostProps {
  instanceKey: string;
  displayName?: string;
  initial?: Record<string, unknown>;
  Component: ComponentType;
  // Everything below is what react-grid-layout injects into each child.
  style?: CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLElement>;
  children?: ReactNode;
}

// Measure the card's actual rendered size via ResizeObserver instead of
// parsing `style.width` as a number. react-grid-layout hands us "300px"
// which parseFloats fine, but the isolation route passes "100%" (parses
// to 100 — wrong scale). Measuring the DOM works in both cases and is
// reactive to container resizes.
const useMeasuredSize = () => {
  const [size, setSize] = useState<WidgetWidth>({ width: 0, height: 0 });
  const elRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [elRef, size] as const;
};

export const WidgetHost = forwardRef<HTMLDivElement, WidgetHostProps>(
  ({ instanceKey, displayName, initial, Component, children, ...gridProps }, ref) => {
    const [measuredRef, size] = useMeasuredSize();

    // Compose the caller's forwarded ref with our measurement ref.
    const setRefs = (node: HTMLDivElement | null) => {
      measuredRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <Card ref={setRefs} {...gridProps}>
        <InstanceProvider instanceKey={instanceKey} displayName={displayName} initial={initial ?? {}}>
          <WidgetWidthContext.Provider value={size}>
            <Suspense fallback={<LoadingCardContent />}>
              <Component />
            </Suspense>
          </WidgetWidthContext.Provider>
        </InstanceProvider>
        {children}
      </Card>
    );
  },
);
WidgetHost.displayName = "WidgetHost";
