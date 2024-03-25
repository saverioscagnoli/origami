import { cn } from "@utils";
import { TopbarButtons } from "./topbar-buttons";
import { useDirectory } from "@hooks/use-directory";
import { TopbarMenu } from "./topbar-menu";
import { IconButton } from "@tredici";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const Topbar = () => {
  const { dir, history, historyIndex, goBack, goForward } = useDirectory();

  return (
    <div
      className={cn(
        "w-full h-8",
        "flex justify-between",
        "fixed top-0 left-0",
        "border-b border-b-[--gray-6]",
        "z-30",
        "select-none"
      )}
    >
      <div className={cn("flex items-center", "gap-2")}>
        <TopbarMenu />
        <IconButton
          variant="ghost"
          icon={<ArrowLeftIcon />}
          size="sm"
          disabled={historyIndex.get() === 0}
          onClick={goBack}
        />
        <IconButton
          variant="ghost"
          icon={<ArrowRightIcon />}
          size="sm"
          disabled={historyIndex.get() === history.get().length - 1}
          onClick={goForward}
        />
      </div>

      <div
        className={cn(
          "w-full h-full",
          "flex justify-center items-center",
          "cursor-default",
          "text-sm",
          "text-ellipsis",
          "overflow-hidden",
          "whitespace-nowrap"
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
