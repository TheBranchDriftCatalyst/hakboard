"use client";

import React, { PropsWithChildren, createContext, useCallback, useContext } from 'react';
import { Layout } from 'react-grid-layout';
import { getFromLocalStorage, setToLocalStorage, useLocalStorageState } from '../../hooks/useLocalStorageState';
const debug = createDebugger('dashboard:context');

const SAMPLE_LAYOUT: Layout[] = [
  { w: 10, h: 10, x: 0, y: 0, i: 'rand_id_todo' },
];

type CompactionType = 'vertical' | 'horizontal' | null;

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
  compactionType: CompactionType,
  COMPACTION_TYPES: CompactionType[],
  setCompactionType: (type: 'vertical' | 'horizontal' | null) => void;
}>({
  dashboardItems: [],
  layout: [],
  // onLayoutChange: () => [],
  setIsDirty: () => { },
  onDragAndResize: () => [],
  onAddWidget: () => { },
  onSaveLayout: () => { },
  onLoadLayout: () => { },
  savedLayouts: [],
  currentLayoutName: '',
  onClearLayout: () => { },
  isDirty: false,
  compactionType: null as CompactionType,
  setCompactionType: (CompactionType) => { },
  COMPACTION_TYPES: [] as CompactionType[],
});

import { createDebugger } from '@/lib/debug';
import { uniq } from 'lodash';
import ResponsiveGridWidget from '../ResponsiveGridWidget';
import { Card } from '../ui/card';

const getSavedLayouts = (): string[]  => {
  if (typeof window === 'undefined') {
    return []; // Return default value if localStorage is not available
  }
  return Object.keys(localStorage)
      .filter((key) => key.startsWith("layout:") || key === "layout:dirty")
      .map((key) => key.split(":")[1]);
};


export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children, widgets}: Partial<PropsWithChildren<{widgets: Record<string, Element>}>>) => {
  const [currentLayoutName, setCurrentLayoutName] = useLocalStorageState('current_layout', 'default');
  const [layout, setLayout] = useLocalStorageState('layout:dirty', SAMPLE_LAYOUT);
  const [isDirty, setIsDirty] = useLocalStorageState('isDirty', false);
  const [compactionType, setCompactionType] = useLocalStorageState<'vertical' | 'horizontal' | null>('compactionType', 'vertical');
  
  const [savedLayouts, setSavedLayouts] = useLocalStorageState('savedLayouts', getSavedLayouts());

  const COMPACTION_TYPES: CompactionType[] = ['vertical', 'horizontal', null];
  
  const dashboardItems = layout.map((item: Layout) => (
    <Card key={item.i} data-grid={item} className="animate-out zoom-out duration-100">
      <ResponsiveGridWidget widgetId={item.i} />
    </Card>
  ));

  // useEffect(() => {
  //   setSavedLayouts(getSavedLayouts());
  // }, [setSavedLayouts]);


  const onLayoutChange = (newLayout: Layout[]) => {
    debug('onlayoutchange', newLayout)
    setLayout(newLayout);
    setIsDirty(true);
  }

  const onAddWidget = useCallback((newWidget: Layout) => {
    onLayoutChange([...layout, newWidget]);
  }, [layout, onLayoutChange]);

  const onSaveLayout = (name: string) => {
    debug('onsavelayout', name)
    setToLocalStorage(`layout:${name}`, layout);
    setCurrentLayoutName(name);
    setToLocalStorage('layout:dirty', layout);
    setSavedLayouts((savedLayouts) => uniq([...savedLayouts, name]));
    setIsDirty(false);
  };

  const onLoadLayout = useCallback((layoutName: string) => {
    debug('onloadlayout', layoutName)
    const loadedLayout = getFromLocalStorage(`layout:${layoutName}`, SAMPLE_LAYOUT);
    onLayoutChange(loadedLayout);
    setCurrentLayoutName(layoutName);
    setToLocalStorage('layout:dirty', loadedLayout);
    setIsDirty(false);
  }, [layout, onLayoutChange, setCurrentLayoutName, setIsDirty]);

  const onClearLayout = () => {
    debug
    onLayoutChange([]);
  };

  const onDragAndResize = (newLayout: Layout[]) => {
    debug('ondragandresize', newLayout)
    setLayout(newLayout);
    setIsDirty(true);
  }

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
