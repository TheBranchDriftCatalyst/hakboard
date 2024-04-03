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
import { MenubarShortcut } from "./ui/menubar";
// import { Label, MenubarItemIndicator } from "@radix-ui/react-menubar";
import { use, useCallback, useRef, useState } from "react";
import { useDashboardContext } from "@/hooks/dashboard_context";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, useDialog } from "./ui/dialog";
import { generateRandomId, generateRandomSize } from "@/lib/utils";
import { Layout } from "react-grid-layout";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";


const LoadProfilesMenu = () => {
  const RADIO_ITEMS = ["Dashboard 1", "Panda Tracking", "Boxes for Life"];
  const { addWidgetToLayout, currentLayoutName, loadLayout } = useDashboardContext();
  
  return (
    <MenubarMenu>
        <MenubarTrigger className="MenubarTrigger">Profiles: {currentLayoutName}</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent
            className="MenubarContent"
            align="start"
            sideOffset={5}
            alignOffset={-14}
          >
            <MenubarRadioGroup value={currentLayoutName} onValueChange={loadLayout}>
              {[currentLayoutName].map((item) => (
                <MenubarRadioItem className="MenubarRadioItem inset" key={item} value={item}>
                  {item}
                </MenubarRadioItem>
              ))}
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
  );
}

const SaveDialog = () => {
  const { closeDialog } = useDialog();
  const { saveLayoutAs } = useDashboardContext();

  const name_ref = useRef<HTMLInputElement>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Save Layout</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        <Label htmlFor="layoutName" className="block text-sm font-medium text-gray-700">
          Layout Name
        </Label>
        <Input
          type="text"
          ref={name_ref}
          name="layoutName"
          id="layoutName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => closeDialog()}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            // Handle saving logic here
            closeDialog();
            saveLayoutAs(name_ref.current?.value || 'none');
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export const TopBar = () => {

  const { addWidgetToLayout, currentLayoutName, saveLayoutAs } = useDashboardContext();
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
    addWidgetToLayout(newWidget);
  }
// alright we need to make a few changes here, i want to add a new state to the dashboard context, this state is either dirty or saved, we need to flesh out the support for multiple profiles.  
  const handleSave = () => {
    // Save as needs to do some stuff
    openDialog((<SaveDialog />))
  }

  const handleClear = () => {
    console.log('Clear')
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
      {/* TODO: add a right pushed arrow that will collapse and open the menu bar */}
    </Menubar>
  );
};

