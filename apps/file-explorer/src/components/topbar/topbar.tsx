import { cn } from "@utils";
import { TopbarMenu } from "./topbar-menu";
import { TopbarButtons } from "./topbar-buttons";
import { useDirectory } from "@hooks/use-directory";

const Topbar = () => {
  const { dir } = useDirectory();
  console.log(dir);

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
      <TopbarMenu />
      <div
        className={cn("w-full h-full", "flex items-center")}
        data-tauri-drag-region
      >
        {dir}
      </div>
      <TopbarButtons />
    </div>
  );
};

export { Topbar };
