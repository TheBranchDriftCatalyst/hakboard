import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
type WidgetID = string;

interface WidgetConfigMap {
  [react_state_field: string]: any;
}

interface ConfigStore {
  [widget_id: WidgetID]: WidgetConfigMap;
}

export const WidgetConfigContext = createContext<{
  configStore: ConfigStore;
  setConfigStore: Dispatch<SetStateAction<ConfigStore>>;
}>({
  configStore: {},
  setConfigStore: () => {},
});

export const WidgetConfigProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [configStore, setConfigStore] = useState<ConfigStore>({});

  return (
    <WidgetConfigContext.Provider value={{ configStore, setConfigStore }}>
      {children}
    </WidgetConfigContext.Provider>
  );
};
