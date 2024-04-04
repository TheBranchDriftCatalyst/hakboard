"use client";

import { DashboardContextProvider, useDashboardContext } from '@/hooks/dashboard_context';
import Debug from 'debug';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

const debug = Debug('ResponsiveGridLayout')

export const ResponsiveGridLayout = () => {
  const { dashboardItems, layout, onDragAndResize } = useDashboardContext();
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  return (
      <ResponsiveGridLayout
        onDragStop={(layout) => onDragAndResize(layout)}
        onResizeStop={(layout) => onDragAndResize(layout)}
        containerPadding={[5, 5]}
        // onLayoutChange={(layout) => onDragAndResize(layout)}
        draggableCancel="button a .no-drag"
        rowHeight={10}
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 100 }}
      >
        {dashboardItems}
      </ResponsiveGridLayout>
  );
};

export const DashboardLayout = ({children}: { children: ReactNode }) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null; // Do not render if not mounted
  }


  return (
    <DashboardContextProvider>
      {children}
      <ResponsiveGridLayout />
    </DashboardContextProvider>
  );
}

export default DashboardLayout;
