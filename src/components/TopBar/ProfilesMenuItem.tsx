"use client";
import { useDashboardContext } from "@/hooks/dashboard_context";
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarContent,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";

export const LoadProfilesMenu = () => {
  const { onAddWidget, currentLayoutName, onLoadLayout, savedLayoutNames, isDirty } =
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
            onValueChange={onLoadLayout}
          >
            {savedLayoutNames.map((item) => (
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
