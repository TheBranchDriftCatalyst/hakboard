"use client";

import { useDialog } from "@/components/ui/dialog";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar";
import { useDashboardContext } from "@/hooks/dashboard_context";
import { generateRandomId, generateRandomSize } from "@/lib/utils";
import { Layout } from "react-grid-layout";
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

