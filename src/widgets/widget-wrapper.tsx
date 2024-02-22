"use client";

import { Shell, Wrench } from "lucide-react";
import React, {
  ComponentType,
  useState,
  Suspense,
  forwardRef,
  useEffect,
  useLayoutEffect,
  createContext,
  useContext,
  ExoticComponent,
} from "react";
import { JSX } from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { omit } from "lodash";
import { Button } from "@/components/ui/button";
import { useControls } from "leva";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { WidthProviderProps } from "react-grid-layout";

// Component is a HOC that wraps the widget components themselves.
// It handles saving and reloading the props for each widget to local storage.
// It provides an interface (cards) for editing the props of each widget. (currently levo)

interface WidgetGridProps extends React.HTMLAttributes<HTMLElement> {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const LoadingCardContent = () => {
  return (
    <CardContent className="w-full h-full">
      <Shell className="animate-spin" size="128" />
      <div>Loading dah stuff</div>
    </CardContent>
  );
};

interface WidthProviderProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const WidgetWidthContext = createContext<{ width: number; height: number } | null>(null);

export const WidgetWidthProvider = ({ width, height, children }: WidthProviderProps) => {
  return (
    <WidgetWidthContext.Provider value={{ width, height }}>
      {children}
    </WidgetWidthContext.Provider>
  );
};

// Use the WidgetWidthContext to consume the width and height values
export const useWidgetWidth = () => {
  const context = useContext(WidgetWidthContext);
  if (!context) {
    throw new Error("useWidgetWidth must be used within a WidgetWidthProvider");
  }
  return context;
};

// type T = T extends ComponentType<infer P> ? Partial<P> : never;


// Refactor WidgetWrapper to handle default props of WrappedWidget
const WidgetWrapper = <T extends object>(
  WrappedWidget: ComponentType<T>,
  defaultProps: T
) => {
  const WithEditButton = forwardRef<HTMLDivElement, T & WidgetGridProps>(
    (props, ref) => {

      // TODO: this is going to move to custom provider, for now its using leva
      const widgetProps = useControls(WrappedWidget.name, defaultProps) as T;

      const width = parseFloat(props.style?.width as string);
      const height = parseFloat(props.style?.height as string);

      return (
        <Card ref={ref} {...props}>
          
          <WidgetWidthProvider width={width} height={height}>
          <CardContent className={`flex flex-col flex-grow h-full w-full`}>
              <Suspense fallback={<LoadingCardContent />}>
                <WrappedWidget {...widgetProps as T}/>
              </Suspense>
          </CardContent>
          </WidgetWidthProvider>
          {props.children}
        </Card>
      );
    }
  );

  WithEditButton.displayName = `WithEditButton(${
    WrappedWidget.displayName || WrappedWidget.name || "Component"
  })`;

  // It's not necessary to explicitly return defaultProps here as they are handled internally
  return React.memo(WithEditButton);
};

export default WidgetWrapper;
