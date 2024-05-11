import { cn } from "@lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BasicDirLabel } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { useMemo } from "react";

const TopbarDirDisplay = () => {
  const dir = useCurrentDir(state => state.dir);
  const basicDirs = useEnvironment(state => state.basicDirs);

  const starredDir = useMemo(
    () => basicDirs.find(b => b.label === BasicDirLabel.Starred),
    [basicDirs]
  );

  return (
    <span
      data-tauri-drag-region
      className={cn(
        "w-full h-full",
        "text-sm",
        "grid place-items-center",
        "cursor-default",
        "active:data-[tauri-drag-region]:cursor-grabbing"
      )}
    >
      {dir === starredDir?.path ? <StarFilledIcon /> : dir}
    </span>
  );
};

export { TopbarDirDisplay };
