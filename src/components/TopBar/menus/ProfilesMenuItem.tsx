"use client";
import { useDashboardContext } from "@/components/contexts/LayoutContext";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useToast } from "../../ui/use-toast";

export const LoadProfilesMenu = () => {
  const { onAddWidget, currentLayoutName, onLoadLayout, savedLayouts, isDirty, setIsDirty } =
    useDashboardContext();
  const { toast } = useToast();

  return (
    <MenubarMenu>
      <MenubarTrigger className={`MenubarTrigger ${isDirty ? 'text-red-700' : 'text-primary'}`}>
        Profiles: {currentLayoutName}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          className="MenubarContent"
          align="start"
          sideOffset={5}
          alignOffset={-14}
        >
          <MenubarRadioGroup
            value={currentLayoutName}
            onValueChange={(val) => {
              onLoadLayout(val);
              setIsDirty(false)
            }}
            suppressHydrationWarning
          >
            {savedLayouts?.map((item) => (
              <MenubarRadioItem
                className="MenubarRadioItem inset"
                key={item}
                value={item}
              >
                {item}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem onClick={() => {
          localStorage.clear();
          const timeout = 5000;
          toast({ duration: timeout, title: 'Storage Cleared', description: "reload required"});
          setTimeout(() => {
            window.location.reload();
          }, timeout);
        }}>Clear Storage</MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  );
};

export default LoadProfilesMenu;
