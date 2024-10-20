import React from "react";
import { cn } from "~/lib/utils";
import { KnownFolder as KnownFolderType } from "~/zustand/env";

type KnownFolderProps = KnownFolderType & {
  onClick: () => void;
};

const KnownFolder: React.FC<KnownFolderProps> = ({ name, icon, onClick }) => {
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
      {/* @ts-ignore */}
      <span>{React.cloneElement(icon, { width: 18, height: 18 })}</span>
      <p>{name}</p>
    </div>
  );
};

export { KnownFolder };
