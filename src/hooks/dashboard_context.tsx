"use client";

import { Card } from '@/components/ui/card';
import { uniq } from 'lodash';
import React, { createContext, useCallback, useContext } from 'react';
import { Layout } from 'react-grid-layout';
import { getFromLocalStorage, getSavedLayoutNames, setToLocalStorage, useLocalStorageControl } from './local_storage_control';

const SAMPLE_LAYOUT: Layout[] = [
  { w: 10, h: 10, x: 0, y: 0, i: 'rand_id_todo' },
];

const DashboardContext = createContext<{
  dashboardItems: React.ReactNode[];
  layout: Layout[];
  onLayoutChange: (newLayout: Layout[]) => void;
  onDragAndResize: (newLayout: Layout[]) => void;
  onAddWidget: (widget: Layout) => void;
  onSaveLayout: (name: string) => void;
  onLoadLayout: (name: string) => void;
  setIsDirty: (dirty: boolean) => void;
  savedLayoutNames: string[];
  currentLayoutName: string;
  onClearLayout: () => void;
  isDirty: boolean;
}>({
  dashboardItems: [],
  layout: [],
  onLayoutChange: () => [],
  setIsDirty: () => { },
  onDragAndResize: () => [],
  onAddWidget: () => { },
  onSaveLayout: () => { },
  onLoadLayout: () => { },
  savedLayoutNames: [],
  currentLayoutName: '',
  onClearLayout: () => { },
  isDirty: false,
});

export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLayoutName, setCurrentLayoutName] = useLocalStorageControl('current_layout', 'default');
  const [savedLayoutNames, setSavedLayoutNames] = useLocalStorageControl('layouts', getSavedLayoutNames());
  const [layout, setLayout] = useLocalStorageControl('layout:dirty', SAMPLE_LAYOUT);
  const [isDirty, setIsDirty] = useLocalStorageControl('isDirty', false);

  const dashboardItems = layout.map((item: Layout) => (
    <Card key={item.i} data-grid={item} className="animate-out zoom-out duration-100"></Card>
  ));


  const onAddWidget = useCallback((newWidget: Layout) => {
    onLayoutChange([...layout, newWidget]);
  }, [layout]);

  const onSaveLayout = (name: string) => {
    console.log('onsavelayout', name)
    setToLocalStorage(`layout:${name}`, layout);
    setCurrentLayoutName(name);
    setSavedLayoutNames((prevNames: string[]) => uniq([...prevNames, name]));
    setToLocalStorage('layout:dirty', layout);
    setIsDirty(false);
  };

  const onLoadLayout = useCallback((layoutName: string) => {
    console.log('onloadlayout', layoutName)
    const loadedLayout = getFromLocalStorage(`layout:${layoutName}`, SAMPLE_LAYOUT);
    onLayoutChange(loadedLayout);
    setCurrentLayoutName(layoutName);
    setToLocalStorage('layout:dirty', loadedLayout);
    setIsDirty(false);
  }, [layout]);

  const onClearLayout = () => {
    console.log
    onLayoutChange([]);
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    console.log('onlayoutchange', newLayout)
    setLayout(newLayout);
    setIsDirty(true);
  }

  const onDragAndResize = (newLayout: Layout[]) => {
    console.log('ondragandresize', newLayout)
    setLayout(newLayout);
    setIsDirty(true);
  }

  return (
    <DashboardContext.Provider
      value={{
        dashboardItems,
        layout,
        onDragAndResize,
        onLayoutChange,
        onAddWidget,
        onSaveLayout,
        onLoadLayout,
        savedLayoutNames,
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
