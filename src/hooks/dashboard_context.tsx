"use client;";

import { Card } from "@/components/ui/card";
import { Layout } from "react-grid-layout";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { setToLocalStorage, getSavedLayoutNames, getFromLocalStorage, useLocalStorageControl as useLocalStorageControls } from "./use_local_storage_controls";
import NoSsr from "@/components/NoSSR";

const SAMPLE_LAYOUT: Layout[] = [
  { w: 10, h: 10, x: 0, y: 0, i: "rand_id_todo" },
];

const DashboardContext = createContext<{
  dashboardItems: React.ReactNode[];
  layout: Layout[];
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>;
  addWidgetToLayout: (widget: Layout) => void;
  saveLayoutAs: (name: string) => void;
  loadLayout: (name: string) => void;
  savedLayoutNames: string[];
  currentLayoutName: string;
  clearLayout: () => void;
}>({
  dashboardItems: [],
  layout: [],
  setLayout: () => {},
  addWidgetToLayout: () => {},
  saveLayoutAs: () => {},
  loadLayout: () => {},
  savedLayoutNames: [],
  currentLayoutName: "",
  clearLayout : () => {},
});

export const DashboardContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // NOTE: these all need to be serializable by default, only caveat (cants serialize ReactNodes)
  const [currentLayoutName, setCurrentLayoutName] = useLocalStorageControls("current_layout", "default");
  const [savedLayoutNames, setSavedLayoutNames] = useLocalStorageControls("saved_layouts", []);
  const [layout, setLayout] = useLocalStorageControls(`layout:${currentLayoutName || "default"}`, SAMPLE_LAYOUT);

  const dashboardItems = layout.map((item: Layout) => (
    <Card key={item.i} data-grid={item}>
      {/* Can add a hoverable trash icon here so that you can remove widgets */}
      Testing
    </Card>
  ));


  const addWidgetToLayout = (newWidget: Layout) => {
    setLayout((prevLayout: Layout[]) => [...prevLayout, newWidget]);
  }
  
  const saveLayoutAs = (name: string) => {
    console.log(`Saving layout as ${name}`);
    setToLocalStorage(`layout:${name}`, layout);
    setCurrentLayoutName(name);
    setSavedLayoutNames(getSavedLayoutNames());
  }

  const loadLayout =(layoutName: string) => {
    const loadedLayout = getFromLocalStorage(`layout:${layoutName}`, SAMPLE_LAYOUT);
    setLayout(loadedLayout);
    setCurrentLayoutName(layoutName);
  };

  return (
    <NoSsr>
      <DashboardContext.Provider
        value={{
          dashboardItems,
          currentLayoutName,
          layout,
          setLayout, // Used to save layout to local storage when the layout changes
          addWidgetToLayout,
          saveLayoutAs,
          loadLayout,
          savedLayoutNames,
          clearLayout: () => setLayout([]),
        }}
      >
        {children}
      </DashboardContext.Provider>
    </NoSsr>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

