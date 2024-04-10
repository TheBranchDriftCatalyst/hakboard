import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createDebugger } from "@/lib/debug";
import { map } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { SheetHeader, SheetTitle } from "../ui/sheet";

const debug = createDebugger("widget:controls");

// TODO: Implement an explicit UseControls schema (allows defining control types)
// TODO: Break this up into some seperate files
// Fix typing

type WidgetName = string;
type PropName = string;
type PropValue = string | number | boolean;

//
type PropSchema =
  | {
      type: "string" | "number" | "boolean";
    }
  | PropValue;

type StepperBarType = {
  min: number;
  max: number;
  step: number;
};

type TextInputType = {};

type WidgetPropertiesType = Record<PropName, PropSchema>;
type WidgetPropsStore = Record<WidgetName, WidgetPropertiesType>;
type UpdateWidgetPropsStore = (
  controlName: keyof WidgetPropsStore,
  props: WidgetPropsStore[keyof WidgetPropsStore],
) => void;

// useControls('test', defaultProps, {}: PropsSchema)

interface WidgetPropsContextInterface {
  widgetProps: WidgetPropsStore;
  updateWidgetProps: UpdateWidgetPropsStore;
}

const WidgetPropsContext = React.createContext<WidgetPropsContextInterface>({
  widgetProps: {},
  updateWidgetProps: () => {},
});

export const WidgetPropsProvider = ({
  children,
}: React.PropsWithChildren<typeof WidgetPropsContext>) => {
  const [widgetProps, setWidgetProps] = useState<WidgetPropsStore>({});

  const updateWidgetProps = useCallback<UpdateWidgetPropsStore>(
    (controlName, props) => {
      debug("updateWidgetProps", controlName, props);
      setWidgetProps((prevProps) => ({
        ...prevProps,
        [controlName]: props,
      }));
    },
    [],
  );

  return (
    <WidgetPropsContext.Provider value={{ widgetProps, updateWidgetProps }}>
      {children}
    </WidgetPropsContext.Provider>
  );
};

export const useControls = (
  controlName: keyof WidgetPropsStore,
  defaultProps: WidgetPropsStore[WidgetName],
) => {
  const { widgetProps, updateWidgetProps } = useContext(WidgetPropsContext);
  const [props, setProps] = useState(defaultProps);

  // Update local state if widgetProps for this controlName changes
  useEffect(() => {
    if (widgetProps[controlName]) {
      setProps(widgetProps[controlName]);
    }
  }, [widgetProps, controlName]);

  useEffect(() => {
    updateWidgetProps(controlName, props);
  }, [props, controlName, updateWidgetProps]);

  return [props, setProps];
};

export const useMasterControls = () => {
  const { widgetProps, updateWidgetProps } = useContext(WidgetPropsContext);
  const [allProps, setAllProps] = useState<WidgetPropsStore>(widgetProps);

  useEffect(() => {
    setAllProps(widgetProps);
  }, [widgetProps]);

  const setProp = useCallback(
    (widgetName: WidgetName, propName: PropName, newValue: PropValue) => {
      const updatedProps = { ...allProps[widgetName], [propName]: newValue };
      updateWidgetProps(widgetName, updatedProps);
    },
    [allProps, updateWidgetProps],
  );

  return [allProps, setProp];
};

const WidgetControls = () => {
  console.log(useContext(WidgetPropsContext));
  const [allProps, setProp] = useMasterControls();

  debug("allProps", allProps);

  return (
    <div className="p-4">
      <SheetHeader>
        <SheetTitle>Widget Controls</SheetTitle>
      </SheetHeader>
      <ScrollArea>
        <Accordion type="single" collapsible>
          {map(
            allProps,
            (
              props: WidgetPropsStore[WidgetName],
              widgetName: keyof WidgetPropsStore,
            ) => {
              return (
                <AccordionItem key={widgetName} value={widgetName}>
                  <AccordionTrigger>{widgetName}</AccordionTrigger>
                  {map(props, (value, propName) => (
                    // TODO: add boolean and input types here at some point
                    <AccordionContent key={widgetName + "-" + propName}>
                      <Label htmlFor={propName}>{propName}</Label>
                      <Input
                        type="text"
                        id={String(propName)}
                        value={String(value)}
                        onChange={(e) =>
                          setProp(widgetName, propName, e.target.value)
                        }
                      />
                    </AccordionContent>
                  ))}
                </AccordionItem>
              );
            },
          )}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default WidgetControls;
