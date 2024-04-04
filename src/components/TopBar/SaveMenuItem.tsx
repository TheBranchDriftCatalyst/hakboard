"use client";
import { useDashboardContext } from "@/hooks/dashboard_context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, useDialog } from "@/components/ui/dialog";

interface SaveDialogProps {
  onSave: (name: string) => void;
  currentLayoutName: string;
}

export const SaveDialog = ({ onSave, currentLayoutName}: SaveDialogProps) => {
  const { closeDialog } = useDialog();
  const name_ref = useRef<HTMLInputElement>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-primary">Save Layout</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        <Label
          htmlFor="layoutName"
          className="block text-sm font-medium text-secondary"
        >
          Layout Name
        </Label>
        <Input
          type="text"
          ref={name_ref}
          placeholder={`${currentLayoutName}`}
          name="layoutName"
          id="layoutName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indig≥o-500 sm:text-sm"
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
            console.log('saving layout', name_ref.current?.value || currentLayoutName)
            onSave(name_ref.current?.value || currentLayoutName);
            closeDialog();
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};


export default SaveDialog;