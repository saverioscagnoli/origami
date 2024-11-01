import React, { ReactElement, ReactNode } from "react";
import { cn } from "~/lib/utils";
import { useDir } from "~/stores/dir";

type KnownFolderProps = {
  name: string;
  path: string;
  icon: ReactNode;
};

const KnownFolder: React.FC<KnownFolderProps> = ({ name, path, icon }) => {
  const cd = useDir(s => s.cd);

  const onClick = () => cd(path);

  return (
    <div
      className={cn(
        "w-full",
        "flex items-center gap-2",
        "pl-6 py-[3px]",
        "cursor-pointer",
        "hover:bg-[--gray-3]"
      )}
      onClick={onClick}
    >
      {React.cloneElement(icon as ReactElement, { width: 18, height: 18 })}
      <p>{name}</p>
    </div>
  );
};

export { KnownFolder };
