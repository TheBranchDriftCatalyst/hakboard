import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';
import { map } from 'lodash';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const debug = require('debug')('widget:controls');

const WidgetPropsContext = React.createContext({
  widgetProps: {},
  updateWidgetProps: () => {},
});

export const WidgetPropsProvider = ({ children }) => {
  const [widgetProps, setWidgetProps] = useState({});

  const updateWidgetProps = useCallback((controlName, props) => {
    debug('updateWidgetProps', controlName, props);
    setWidgetProps((prevProps) => ({
      ...prevProps,
      [controlName]: props,
    }));
  }, []);

  return (
    <WidgetPropsContext.Provider value={{ widgetProps, updateWidgetProps }}>
      {children}
    </WidgetPropsContext.Provider>
  );
};

// export const useControls = (controlName, defaultProps) => {
//   const { widgetProps, updateWidgetProps } = useContext(WidgetPropsContext);
//   const [props, setProps] = useState(defaultProps);
//   debug(controlName, { props});
//   useEffect(() => {
//     updateWidgetProps(controlName, props);
//   }, [props, controlName, updateWidgetProps]);

//   return [props, setProps];
// };

export const useControls = (controlName, defaultProps) => {
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
  const [allProps, setAllProps] = useState(widgetProps);

  useEffect(() => {
    setAllProps(widgetProps);
  }, [widgetProps]);

  const setProp = useCallback((widgetName, propName, newValue) => {
    const updatedProps = { ...allProps[widgetName], [propName]: newValue };
    updateWidgetProps(widgetName, updatedProps);
  }, [allProps, updateWidgetProps]);

  return [allProps, setProp, widgetProps];
};

const WidgetControls = () => {
  console.log(useContext(WidgetPropsContext))
  const [allProps, setProp] = useMasterControls();

  debug('allProps', allProps);

  return (
    <div className="p-4">
      <SheetHeader>
        <SheetTitle>Widget Controls</SheetTitle>
      </SheetHeader>
      <Accordion type="single" collapsible>
      {
        map(allProps, (props, widgetName) => {
          return (
            <AccordionItem key={widgetName} value={widgetName}>
              <AccordionTrigger>{widgetName}</AccordionTrigger>
              {
                Object.entries(props).map(([propName, value]) => (
                  <AccordionContent>
                    <Label htmlFor={propName}>{propName}</Label>
                    <Input
                      type="text"
                      id={propName}
                      value={value}
                      onChange={(e) => setProp(widgetName, propName, e.target.value)}
                    />
                  </AccordionContent>
              ))
              }
            </AccordionItem>
          )
        })
      }
      </Accordion>
    </div>
  );
};

export default WidgetControls;
