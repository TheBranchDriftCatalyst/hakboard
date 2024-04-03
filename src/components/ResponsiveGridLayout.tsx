"use client";

import React, { useEffect, useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { Card } from './ui/card';
import Debug from 'debug';
import { DashboardContextProvider, useDashboardContext } from '@/hooks/dashboard_context';

const debug = Debug('ResponsiveGridLayout')

export const ResponsiveGridLayout = () => {
  const { dashboardItems, layout, setLayout } = useDashboardContext();
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  return (
      <ResponsiveGridLayout
        containerPadding={[5, 5]}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
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
  return (
    <DashboardContextProvider>
      {children}
      <ResponsiveGridLayout />
    </DashboardContextProvider>
  );
}

export default DashboardLayout;
