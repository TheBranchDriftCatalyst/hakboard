"use client";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { MenubarShortcut } from "../ui/menubar";
import { use, useCallback, useRef, useState } from "react";
import { useDashboardContext } from "@/hooks/dashboard_context";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, useDialog } from "../ui/dialog";
import { generateRandomId, generateRandomSize } from "@/lib/utils";
import { Layout } from "react-grid-layout";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import LoadProfilesMenu from "./ProfilesMenuItem";
import SaveDialog from "./SaveMenuItem";

export const TopBar = () => {

  const { onAddWidget, currentLayoutName, onSaveLayout, onClearLayout  } = useDashboardContext();
  const { openDialog } = useDialog();
  
  const addBox = () => {
    console.log('Adding Box')
    const newWidget: Layout = {
      w: generateRandomSize(),
      h: generateRandomSize(),
      x: generateRandomSize(),
      y: generateRandomSize(),
      i: generateRandomId(),
    };
    onAddWidget(newWidget);
  }
// alright we need to make a few changes here, i want to add a new state to the dashboard context, this state is either dirty or saved, we need to flesh out the support for multiple profiles.  
  const handleSave = () => {
    console.log("handling save (opening dialog")
    openDialog((<SaveDialog onSave={onSaveLayout} currentLayoutName={currentLayoutName}/>))
  }

  const handleClear = () => {
    console.log('Clear')
    onClearLayout()
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger onClick={addBox}>Add Box</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleClear}>Clear</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleSave}>Save...</MenubarTrigger>
      </MenubarMenu>
      <LoadProfilesMenu />
    </Menubar>
  );
};

