import { cn } from "@utils";
import { TopbarButtons } from "./topbar-buttons";
import { useDirectory } from "@hooks/use-directory";
import { TopbarMenu } from "./topbar-menu";

const Topbar = () => {
  const { dir } = useDirectory();

  return (
    <div
      className={cn(
        "w-full h-8",
        "flex justify-between",
        "fixed top-0 left-0",
        "border-b border-b-[--gray-6]",
        "z-30"
      )}
    >
      <TopbarMenu />
      <div
        className={cn(
          "w-full h-full",
          "flex justify-center items-center",
          "cursor-default",
          "text-sm"
        )}
        data-tauri-drag-region
      >
        {dir.get()}
      </div>
      <TopbarButtons />
    </div>
  );
};

export { Topbar };
