import React, { createContext, useState, useContext, useEffect } from 'react';
import { Layout } from 'react-grid-layout';
import { Card } from '@/components/ui/card';
import { useLocalStorageControl, setToLocalStorage, getSavedLayoutNames, getFromLocalStorage } from './use_local_storage_controls';
import { set } from 'lodash';

const SAMPLE_LAYOUT: Layout[] = [
  { w: 10, h: 10, x: 0, y: 0, i: 'rand_id_todo' },
];

const DashboardContext = createContext<{
  dashboardItems: React.ReactNode[];
  layout: Layout[];
  onLayoutChange: (newLayout: Layout[]) => void;
  onAddWidget: (widget: Layout) => void;
  onSaveLayout: (name: string) => void;
  onLoadLayout: (name: string) => void;
  savedLayoutNames: string[];
  currentLayoutName: string;
  onClearLayout: () => void;
  isDirty: boolean;
}>({
  dashboardItems: [],
  layout: [],
  onLayoutChange: () => [],
  onAddWidget: () => {},
  onSaveLayout: () => {},
  onLoadLayout: () => {},
  savedLayoutNames: [],
  currentLayoutName: '',
  onClearLayout: () => {},
  isDirty: false,
});

export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLayoutName, setCurrentLayoutName] = useLocalStorageControl('current_layout', 'default');
  const [savedLayoutNames, setSavedLayoutNames] = useLocalStorageControl('layouts', getSavedLayoutNames());
  const [layout, setLayout] = useLocalStorageControl('layout:dirty', SAMPLE_LAYOUT);
  const [isDirty, setIsDirty] = useState(true);

  const dashboardItems = layout.map((item: Layout) => (
    <Card key={item.i} data-grid={item}>Testing</Card>
  ));

  const onAddWidget = (newWidget: Layout) => {
    onLayoutChange([...layout, newWidget]);
  };

  const onSaveLayout = (name: string) => {
    setToLocalStorage(`layout:${name}`, layout);
    setCurrentLayoutName(name);
    setSavedLayoutNames((prevNames) => [...prevNames, name]);
    setToLocalStorage('layout:dirty', layout);
  };

  const onLoadLayout = (layoutName: string) => {
    const loadedLayout = getFromLocalStorage(`layout:${layoutName}`, SAMPLE_LAYOUT);
    onLayoutChange(loadedLayout);
    setCurrentLayoutName(layoutName);
    setToLocalStorage('layout:dirty', loadedLayout);
  };

  const onClearLayout = () => {
    onLayoutChange([]);
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  }

  const onDragableChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  }

  return (
    <DashboardContext.Provider
      value={{
        dashboardItems,
        layout,
        onLayoutChange,
        onAddWidget,
        onSaveLayout,
        onLoadLayout,
        savedLayoutNames,
        currentLayoutName,
        onClearLayout,
        isDirty,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
