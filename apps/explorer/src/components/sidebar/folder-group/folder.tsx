import { cn } from "@lib/utils";
import { FC, ReactNode } from "react";

type SidebarFolderProps = {
  icon: ReactNode;
  name: string;
  onClick: () => void;
};

const SidebarFolder: FC<SidebarFolderProps> = ({ icon, name, onClick }) => {
  return (
    <div
      className={cn(
        "w-full",
        "flex items-center gap-2",
        "px-4 py-0.5",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        "truncate"
      )}
      onClick={onClick}
    >
      <span>{icon}</span>
      <p>{name}</p>
    </div>
  );
};

export { SidebarFolder };
