"use client";

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from "react";
import { Layout } from "react-grid-layout";
import {
  getFromLocalStorage,
  setToLocalStorage,
  useLocalStorageState,
} from "../../hooks/useLocalStorageState";
const debug = createDebugger("dashboard:context");

type CompactionType = "vertical" | "horizontal" | null;

const DashboardContext = createContext<{
  dashboardItems: React.ReactNode[];
  layout: Layout[];
  // onLayoutChange: (newLayout: Layout[]) => void;
  onDragAndResize: (newLayout: Layout[]) => void;
  onAddWidget: (widget: Layout) => void;
  onSaveLayout: (name: string) => void;
  onLoadLayout: (name: string) => void;
  setIsDirty: (dirty: boolean) => void;
  savedLayouts: string[];
  currentLayoutName: string;
  onClearLayout: () => void;
  isDirty: boolean;
  compactionType: CompactionType;
  COMPACTION_TYPES: CompactionType[];
  setCompactionType: (type: "vertical" | "horizontal" | null) => void;
}>({
  dashboardItems: [],
  layout: [],
  // onLayoutChange: () => [],
  setIsDirty: () => {},
  onDragAndResize: () => [],
  onAddWidget: () => {},
  onSaveLayout: () => {},
  onLoadLayout: () => {},
  savedLayouts: [],
  currentLayoutName: "",
  onClearLayout: () => {},
  isDirty: false,
  compactionType: null as CompactionType,
  setCompactionType: (CompactionType) => {},
  COMPACTION_TYPES: [] as CompactionType[],
});

import { createDebugger } from "@/lib/debug";
import { uniq } from "lodash";
import { Trash, WrenchIcon } from "lucide-react";
import ResponsiveGridWidget from "../ResponsiveGridWidget";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const getSavedLayouts = (): string[] => {
  if (typeof window === "undefined") {
    return []; // Return default value if localStorage is not available
  }
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("layout:") || key === "layout:dirty")
    .map((key) => key.split(":")[1]);
};

const stopProp = (event: React.MouseEvent) => event.stopPropagation();

export const DashboardContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
  widgets,
}: Partial<PropsWithChildren<{ widgets: Record<string, Element> }>>) => {
  const [currentLayoutName, setCurrentLayoutName] = useLocalStorageState(
    "current_layout",
    "default"
  );
  const [layout, setLayout] = useLocalStorageState(
    "layout:dirty",
    [] as (Layout | never)[]
  );
  const [isDirty, setIsDirty] = useLocalStorageState("isDirty", false);
  const [compactionType, setCompactionType] = useLocalStorageState<
    "vertical" | "horizontal" | null
  >("compactionType", "vertical");

  const [savedLayouts, setSavedLayouts] = useLocalStorageState(
    "savedLayouts",
    getSavedLayouts()
  );

  const handleRemoveWidget = useCallback(
    (widgetId: string) => () => {
    setLayout((currentLayout) =>
      currentLayout.filter((item) => item.i !== widgetId)
    );
  }, [layout, setLayout]
  );

  const COMPACTION_TYPES: CompactionType[] = ["vertical", "horizontal", null];

  const dashboardItems = layout.map((item: Layout) => (
    <Card
      key={item.i}
      data-grid={item}
      className="group animate-out zoom-out duration-100 relative"
    >
      {/* TODO: maybe, might change these to a consolidated topbar/menubar */}
      <Button
        className="z-[40] rounded-full absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        variant="ghost"
        size="icon"
        onMouseDown={stopProp}
        onClick={handleRemoveWidget(item.i)}
      >
        <Trash className="text-destructive" />
      </Button>
      <ResponsiveGridWidget widgetId={item.i} />
      <Button
        className="z-[40] rounded-full absolute left-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        variant="ghost"
        size="icon"
        onMouseDown={stopProp}
        onClick={() => console.log('TODO')}
      >
        <WrenchIcon className="text-primary" />
      </Button>
    </Card>
  ));

  // useEffect(() => {
  //   setSavedLayouts(getSavedLayouts());
  // }, [setSavedLayouts]);

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    debug("onLayoutChange", newLayout);
    setLayout(newLayout);
    setIsDirty(true);
  }, [setLayout, setIsDirty]);

  const onAddWidget = useCallback(
    (newWidget: Layout) => {
      onLayoutChange([...layout, newWidget]);
    },
    [layout, onLayoutChange]
  );

  const onSaveLayout = (name: string) => {
    debug("onSaveLayout", name);
    setToLocalStorage(`layout:${name}`, layout);
    setCurrentLayoutName(name);
    setToLocalStorage("layout:dirty", layout);
    setSavedLayouts((savedLayouts) => uniq([...savedLayouts, name]));
    setIsDirty(false);
  };

  const onLoadLayout = useCallback(
    (layoutName: string) => {
      debug("onLoadLayout", layoutName);
      const loadedLayout = getFromLocalStorage(
        `layout:${layoutName}`,
        [] as (Layout | never)[]
      );
      onLayoutChange(loadedLayout);
      setCurrentLayoutName(layoutName);
      setToLocalStorage("layout:dirty", loadedLayout);
      setIsDirty(false);
    },
    [layout, onLayoutChange, setCurrentLayoutName, setIsDirty]
  );

  const onClearLayout = () => {
    onLayoutChange([]);
  };

  const onDragAndResize = (newLayout: Layout[]) => {
    debug("onDragAndResize", newLayout);
    setLayout(newLayout);
    setIsDirty(true);
  };

  return (
    <DashboardContext.Provider
      value={{
        COMPACTION_TYPES,
        dashboardItems,
        savedLayouts,
        layout,
        onDragAndResize,
        compactionType,
        setCompactionType,
        onAddWidget,
        onSaveLayout,
        onLoadLayout,
        currentLayoutName,
        onClearLayout,
        isDirty,
        setIsDirty,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
