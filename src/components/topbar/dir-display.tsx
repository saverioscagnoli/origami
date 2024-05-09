import { cn } from "@lib/utils";
import { useCurrentDir } from "@zustand/curent-dir-store";

const TopbarDirDisplay = () => {
  const dir = useCurrentDir(state => state.dir);

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
      {dir}
    </span>
  );
};

export { TopbarDirDisplay };
