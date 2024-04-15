import { useCurrentDir } from "@hooks/use-current-dir";
import { cn } from "@lib/utils";

const TopbarDirDisplay = () => {
  const { dir } = useCurrentDir();

  return (
    <div
      data-tauri-drag-region
      id="topbar-dir-display"
      className={cn(
        "w-full h-full",
        "grid place-items-center",
        "cursor-default",
        "active:data-[tauri-drag-region]:cursor-grabbing"
      )}
    >
      {dir()}
    </div>
  );
};

export { TopbarDirDisplay };
