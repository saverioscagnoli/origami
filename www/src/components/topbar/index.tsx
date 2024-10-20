import React from "react";
import { cn } from "~/lib/utils";
import { ButtonGroup } from "./button-group";
import { DirDisplay } from "./dir-display";
import { TopbarMenu } from "./menubar";

const Topbar: React.FC = () => {
  return (
    <nav
      className={cn(
        "w-full h-8",
        "fixed top-0 left-0 right-0",
        "flex items-center justify-between",
        "border-b border-b-[--gray-6]"
      )}
    >
      <TopbarMenu />
      <DirDisplay />
      <ButtonGroup />
    </nav>
  );
};

export { Topbar };
