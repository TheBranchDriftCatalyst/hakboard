import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, useDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

interface SaveDialogProps {
  onSave: (name: string) => void;
  currentLayoutName: string;
}

export const SaveDialog = ({ onSave, currentLayoutName}: SaveDialogProps) => {
  const { closeDialog } = useDialog();
  const name_ref = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    console.log('saving layout', name_ref.current?.value || currentLayoutName);
    onSave(name_ref.current?.value || currentLayoutName);
    closeDialog();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

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
          className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
          onKeyDown={handleKeyPress}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="destructive"
          className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => closeDialog()}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SaveDialog;
