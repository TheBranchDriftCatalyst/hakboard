import { WidgetConfigContext } from "@/components/contexts/WidgetConfigContext";
import { createDebugger } from "@/lib/debug";
import { Dispatch, SetStateAction, useContext, useState } from "react";

const debug = createDebugger('widget:controller');

export const useWidgetController = (widgetId: string) => {
    const { configStore, setConfigStore } = useContext(WidgetConfigContext);
    
    debug('Initializing controller for widget:', widgetId);

    const setConfigValue = <T>(fieldName: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
        debug(`Getting initial value for ${fieldName} in widget ${widgetId}`);
        const [value, setValue] = useState<T>(() => {
            return configStore[widgetId]?.[fieldName] ?? initialValue;
        });

        const setControlledValue: Dispatch<SetStateAction<T>> = (newValue) => {
            debug(`Setting value for ${fieldName} in widget ${widgetId}:`, newValue);
            setValue(newValue);
            setConfigStore((prevConfigStore) => {
                const newConfigStore = {
                    ...prevConfigStore,
                    [widgetId]: {
                        ...prevConfigStore[widgetId],
                        [fieldName]: newValue
                    }
                };
                debug(`Updated config store for widget ${widgetId}:`, newConfigStore[widgetId]);
                return newConfigStore;
            });
        };

        return [value, setControlledValue];
    };

    return { setConfigValue };
};
