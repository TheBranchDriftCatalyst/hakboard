import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

export interface WidgetConfigMap {
  [react_state_field: string]: any;
}

export interface ConfigStore {
  [widget_id: string]: WidgetConfigMap;
}

export const WidgetConfigContext = createContext<{
  configStore: ConfigStore;
  setConfigStore: Dispatch<SetStateAction<ConfigStore>>;
}>({
  configStore: {},
  setConfigStore: () => {},
});

//  TODO: lets convert this to a dispatch/reduce, pattern maybe???
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
