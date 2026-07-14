import {
  createContext,
  forwardRef,
  Suspense,
  useContext,
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

export const WidgetHost = forwardRef<HTMLDivElement, WidgetHostProps>(
  ({ instanceKey, displayName, initial, Component, children, ...gridProps }, ref) => {
    const width = parseFloat(String(gridProps.style?.width ?? "0"));
    const height = parseFloat(String(gridProps.style?.height ?? "0"));

    return (
      <Card ref={ref} {...gridProps}>
        <InstanceProvider instanceKey={instanceKey} displayName={displayName} initial={initial ?? {}}>
          <WidgetWidthContext.Provider value={{ width, height }}>
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
