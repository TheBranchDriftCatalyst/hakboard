"use client";

import { useDashboardContext } from "@/components/contexts/LayoutContext";
import { useDialog } from "@/components/ui/dialog";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { generateRandomSize, generateRandomWidgetID } from "@/lib/utils";
import { ArrowLeftToLine, ArrowRightIcon } from "lucide-react";
import { Layout } from "react-grid-layout";
import SaveLayoutDialog from "../dialogs/SaveLayoutDialog";
import { Button } from "../ui/button";
import LoadProfilesMenu from "./menus/ProfilesMenuItem";

export const TopBar = () => {
  const [barCollapsed, setBarCollapsed] = useLocalStorageState("topbar:hidden", false);
  const { onAddWidget, currentLayoutName, onSaveLayout, onClearLayout } = useDashboardContext();
  const { openDialog } = useDialog();

  const addBox = () => {
    console.log("Adding Box");
    const newWidget: Layout = {
      w: generateRandomSize(),
      h: generateRandomSize(),
      x: generateRandomSize(),
      y: generateRandomSize(),
      i: generateRandomWidgetID(),
    };
    onAddWidget(newWidget);
  };
  // alright we need to make a few changes here, i want to add a new state to the dashboard context, this state is either dirty or saved, we need to flesh out the support for multiple profiles.
  const handleSave = () => {
    console.log("handling save (opening dialog");
    openDialog(
      <SaveLayoutDialog onSave={onSaveLayout} currentLayoutName={currentLayoutName} />
    );
  };

  const handleClear = () => {
    console.log("Clear");
    onClearLayout();
  };

  if (barCollapsed) {
    return (
      <Button
        className="opacity-40 hover:opacity-100 text-primary absolute z-50"
        variant="ghost"
        size="icon"
        onClick={() => setBarCollapsed((a: boolean) => !a)}
      >
        <ArrowRightIcon className="text-primary h-5 w-5" />
      </Button>
    );
  }

  return (
    <Menubar className="opacity-50 absolute z-50 w-full">
      <MenubarMenu>
        <MenubarTrigger onClick={() => setBarCollapsed((a) => !a)}>
          <ArrowLeftToLine className="text-primary h-5 w-5" />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={addBox}>Add Box</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleClear}>Clear</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleSave}>Save</MenubarTrigger>
      </MenubarMenu>
      <LoadProfilesMenu />
    </Menubar>
  );
};
