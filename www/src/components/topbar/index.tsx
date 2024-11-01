import React from "react";
import { cn } from "~/lib/utils";
import { TopbarButtonGroup } from "./button-group";
import { DirDisplay } from "./dir-display";
import { TopbarMenu } from "./menubar";

const Topbar: React.FC = () => {
  return (
    <div
      style={{ widows: 1 }}
      className={cn(
        "w-full h-7",
        "flex items-center justify-between",
        "fixed top-0",
        "border-b border-b-[--gray-6]"
      )}
    >
      <TopbarMenu />
      <DirDisplay />
      <TopbarButtonGroup />
    </div>
  );
};

export { Topbar };
