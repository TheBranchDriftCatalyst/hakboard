"use client";
import GridLayout, {
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
// import { Resizable } from "react-resizable";
import { withSize } from 'react-sizeme'

import { Toaster } from "@/components/ui/toaster";

import { Card } from "@/components/ui/card";
import { ClassAttributes, ForwardRefRenderFunction, Fragment, HTMLAttributes, JSX, forwardRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { set } from "lodash";
import ResponsiveGridLayout from "@/components/ResponsiveGridLayout";
import { useSearchParams } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast";
import { WidgetPropsProvider, useControls } from "@/components/sheets/WidgetControlSheet";
import Background from "@/widgets/background";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { TopBar } from "@/components/TopBar";
import { DialogProvider } from "@/components/ui/dialog";



export default function Home() {
  return (
    <main>
      <QueryClientProvider client={new QueryClient()}>
        <DialogProvider>
          <ResponsiveGridLayout>
            {/* add these here so they get wrapped in the context */}
            <Toaster />
            <TopBar />
          </ResponsiveGridLayout>
        </DialogProvider>
      </QueryClientProvider>
    </main>
  );
}
