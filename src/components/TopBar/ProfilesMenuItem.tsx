"use client";
import {
  MenubarContent,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDashboardContext } from "@/hooks/dashboard_context";

export const LoadProfilesMenu = () => {
  const { onAddWidget, currentLayoutName, onLoadLayout, savedLayoutNames, isDirty, setIsDirty } =
    useDashboardContext();

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
            {savedLayoutNames?.map((item) => (
              <MenubarRadioItem
                className="MenubarRadioItem inset"
                key={item}
                value={item}
              >
                {item}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  );
};

export default LoadProfilesMenu;
