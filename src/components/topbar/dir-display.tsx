import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";
import { SearchInput } from "./search-input";

const TopbarDirDisplay = () => {
  const { dir } = useCurrentDir();
  const { searching } = useGlobalStates();

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
      {searching.state ? <SearchInput /> : dir}
    </span>
  );
};

export { TopbarDirDisplay };
