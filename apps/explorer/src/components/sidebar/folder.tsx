import { useAccessor } from "@hooks/use-accessor";
import { useGlobalStates } from "@hooks/use-global-states";
import { capitalize, cn } from "@utils";
import React, { ReactNode } from "react";

type SidebarProps = {
  icon: ReactNode;
  label: string;
  path: string;
  onClick: () => Promise<void>;
};

const SidebarFolder: React.FC<SidebarProps> = ({ icon, label, onClick }) => {
  const hover = useAccessor<boolean>(false);
  const { dragging } = useGlobalStates();

  console.log(hover.get());

  return (
    <div
      onDragEnter={() => console.log("ddfdf")}
      onMouseEnter={hover.toggle}
      onMouseLeave={hover.toggle}
      className={cn(
        "w-full",
        "flex items-center gap-2",
        "px-4 py-0.5",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        "truncate",
        hover.get() && dragging.get() && "bg-[--gray-3]"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
};

export { SidebarFolder };
