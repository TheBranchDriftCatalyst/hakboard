import { WidgetConfigContext, WidgetConfigMap } from "@/components/contexts/WidgetConfigContext";
import { createDebugger } from "@/lib/debug";
import {
  useContext,
  useState
} from "react";

const debug = createDebugger("widget:controller");

/**
 * Manages the state and configuration of a widget identified by widgetId.
 * @param {string} widgetId - The unique identifier of the widget.
 * @param {WidgetConfigMap} initialState - The initial state and configuration of the widget.
 * @returns {{ props: WidgetConfigMap, setConfigValue: (fieldName: string, value: T) => void }} - An object containing the widget properties and a function to update the configuration values.
 */
export const useWidgetController = (
  widgetId: string,
  initialState: WidgetConfigMap
) => {
  const { configStore, setConfigStore } = useContext(WidgetConfigContext);

  debug("Initializing controller for widget:", widgetId);

  const [widgetProps, setWidgetProps] = useState<WidgetConfigMap>(() => {
    return { ...initialState, ...configStore[widgetId] };
  });

  const setConfigValue = <T>(
    fieldName: string,
    value: T
  ): void => {
    debug(`Setting value for ${fieldName} in widget ${widgetId}:`, value);
    setWidgetProps((prevProps) => {
      const newProps = { ...prevProps, [fieldName]: value };
      setConfigStore((prevConfigStore) => ({
        ...prevConfigStore,
        [widgetId]: newProps,
      }));
      debug(
        `Updated config store for widget ${widgetId}:`,
        newProps
      );
      return newProps;
    });
  };

  return { props: widgetProps, setConfigValue };
};
