import { useCurrentDir } from "@contexts/current-dir";
import { cn } from "@lib/utils";

const TopbarDirDisplay = () => {
  const { dir } = useCurrentDir();

  return (
    <span
      data-tauri-drag-region
      id="topbar-dir-display"
      className={cn(
        "w-full h-full",
        "text-sm",
        "grid place-items-center",
        "cursor-default",
        "active:data-[tauri-drag-region]:cursor-grabbing"
      )}
    >
      {dir()}
    </span>
  );
};

export { TopbarDirDisplay };
