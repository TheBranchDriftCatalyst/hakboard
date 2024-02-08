"use client";

import { Wrench } from "lucide-react";
import React, {
  ComponentType,
  useState,
  Suspense,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { JSX } from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { omit } from "lodash";
import { Button } from "@/components/ui/button";
import { useControls } from "leva";
import { ScrollArea } from "@/components/ui/scroll-area";

// Component is a HOC that wraps the widget components themselves.
// It handles saving and reloading the props for each widget to local storage.
// It provides an interface (flippable cards) for editing the props of each widget.

interface WidgetGridProps extends React.HTMLAttributes<HTMLElement> {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

// Refactor WidgetWrapper to handle default props of WrappedWidget
const WidgetWrapper = <T extends object>(
  WrappedWidget: ComponentType<T>,
  defaultProps: T
) => {
  const WithEditButton = forwardRef<HTMLDivElement, T & WidgetGridProps>(
    (props, ref) => {
      const [editableProps, setEditableProps] = useState(defaultProps);

      const widgetProps = useControls(WrappedWidget.name, editableProps) as T;

      const width = parseFloat(props.style?.width as string);
      const height = parseFloat(props.style?.height as string);

      console.log("WidgetWrapper", {
        WrappedWidget,
        defaultProps,
        widgetProps,
        props,
        ref,
      });

      return (
        <Card ref={ref} {...props} >
          {/* <CardHeader>
            <CardTitle>{WrappedWidget.displayName || WrappedWidget.name}</CardTitle>
          </CardHeader> */}
          <CardContent className={`flex flex-col flex-grow h-full`}>
              <Suspense fallback={<LoadingWidget />}>
                  <ScrollArea>
                    <WrappedWidget {...widgetProps} />
                  </ScrollArea>
              </Suspense>
          </CardContent>
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

const LoadingWidget = () => <div>Loading...</div>;
