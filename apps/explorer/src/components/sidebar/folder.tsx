import { cn } from "@utils";
import React, { ReactNode } from "react";

type SidebarProps = {
  icon: ReactNode;
  label: string;
  path: string;
  onClick: () => Promise<void>;
};

const SidebarFolder: React.FC<SidebarProps> = ({ icon, label, onClick }) => {
  console.log(label);
  return (
    <div
      className={cn(
        "w-full",
        "flex items-center gap-2",
        "px-4 py-0.5",
        "cursor-pointer",
        "hover:bg-[--gray-3]"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
};

export { SidebarFolder };
