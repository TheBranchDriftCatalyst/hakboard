"use client";

import { JSX } from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;
// import { useControls } from "leva";
// import { WidthProviderProps } from "react-grid-layout";

// NOTE: widget ID is of the form <widgetType>:<widgetId>

const ResponsiveGridWidget = ({ widgetId }: { widgetId: string }) => {
  const [widgetType, uuid] = widgetId.split("::");

  return (
    <div className="h-full w-full text-primary">
      <div className={"flex grow flow-row justify-center"}>
        <div>
          {widgetType}: {uuid}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveGridWidget;

// // Component is a HOC that wraps the widget components themselves.
// // It handles saving and reloading the props for each widget to local storage.
// // It provides an interface (cards) for editing the props of each widget. (currently levo)

// interface WidgetGridProps extends React.HTMLAttributes<HTMLElement> {
//   style?: React.CSSProperties;
//   className?: string;
//   onMouseDown?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
//   onMouseUp?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
//   onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void;
//   children?: React.ReactNode;
// }

// const LoadingCardContent = () => {
//   return (
//     <CardContent className="w-full h-full">
//       <Shell className="animate-spin" size="128" />
//       <div>Loading dah stuff</div>
//     </CardContent>
//   );
// };

// interface WidthProviderProps {
//   width: number;
//   height: number;
//   children: React.ReactNode;
// }

// export const WidgetWidthContext = createContext<{
//   width: number;
//   height: number;
// } | null>(null);

// export const WidgetWidthProvider = ({
//   width,
//   height,
//   children,
// }: WidthProviderProps) => {
//   return (
//     <WidgetWidthContext.Provider value={{ width, height }}>
//       {children}
//     </WidgetWidthContext.Provider>
//   );
// };

// // Use the WidgetWidthContext to consume the width and height values
// export const useWidgetWidth = () => {
//   const context = useContext(WidgetWidthContext);
//   if (!context) {
//     throw new Error(
//       "useWidgetWidth must be used within a Widget (WidgetWidthProvider)"
//     );
//   }
//   return context;
// };

// const WidgetWrapper = <T extends object>(
//   WrappedWidget: ComponentType<T>,
//   defaultProps: T
// ) => {
//   const WithEditButton = forwardRef<HTMLDivElement, T & WidgetGridProps>(
//     (props, ref) => {
//       // TODO: this is going to move to custom provider, for now its using leva
//       // const widgetProps = useState(defaultProps);
//       const [widgetProps, setWidgetProps] = useControls(
//         WrappedWidget.name,
//         defaultProps
//       );

//       const width = parseFloat(props.style?.width as string);
//       const height = parseFloat(props.style?.height as string);

//       return (
//         <Card ref={ref} {...props}>
//           <WidgetPropsProvider>
//             <WidgetWidthProvider width={width} height={height}>
//               <Suspense fallback={<LoadingCardContent />}>
//                 <WrappedWidget {...(widgetProps as T)} />
//               </Suspense>
//             </WidgetWidthProvider>
//             {props.children}
//           </WidgetPropsProvider>
//         </Card>
//       );
//     }
//   );

//   WithEditButton.displayName = `WithEditButton(${
//     WrappedWidget.displayName || WrappedWidget.name || "Component"
//   })`;

//   // It's not necessary to explicitly return defaultProps here as they are handled internally
//   return React.memo(WithEditButton);
// };

// export default WidgetWrapper;
