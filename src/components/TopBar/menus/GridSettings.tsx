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
  const { compactionType, setCompactionType, COMPACTION_TYPES } =
    useDashboardContext();
  const { toast } = useToast();

  return (
    <MenubarMenu>
      <MenubarTrigger className={`MenubarTrigger`}>
        Grid Settings
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          className="MenubarContent"
          align="start"
          sideOffset={5}
          alignOffset={-14}
        >
          <MenubarRadioGroup
            value={String(compactionType)}
            onValueChange={(val) => {}}
            // suppressHydrationWarning
          >
            {COMPACTION_TYPES?.map((item) => (
              <MenubarRadioItem
                className="MenubarRadioItem inset"
                key={item}
                value={String(item)}
              >
                {String(item)}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => {
              localStorage.clear();
              const timeout = 5000;
              toast({
                duration: timeout,
                title: "Storage Cleared",
                description: "reload required",
              });
              setTimeout(() => {
                window.location.reload();
              }, timeout);
            }}
          >
            Clear Storage
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  );
};

export default LoadProfilesMenu;
