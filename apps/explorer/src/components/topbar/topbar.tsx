import { cn } from "@utils";
import { TopbarButtons } from "./topbar-buttons";
import { useDirectory } from "@hooks/use-directory";

const Topbar = () => {
  const { dir } = useDirectory();

  return (
    <div
      className={cn(
        "w-full h-8",
        "flex justify-between",
        "fixed top-0 left-0",
        "border-b border-b-[--gray-6]",
        "z-[9999]"
      )}
    >
      <span>Menu</span>
      <div
        className={cn("w-full h-full", "flex justify-center items-center")}
        data-tauri-drag-region
      >
        {dir.get()}
      </div>
      <TopbarButtons />
    </div>
  );
};

export { Topbar };
