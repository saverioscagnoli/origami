import { cn } from "@utils";
import { TopbarButton } from "./topbar-button";
import {
  Cross1Icon,
  MagnifyingGlassIcon,
  MinusIcon,
  SquareIcon
} from "@radix-ui/react-icons";
import { appWindow } from "@tauri-apps/api/window";
import { TopbarMenu } from "./topbar-menu";
import { useCurrentDir } from "@hooks/use-current-dir";
import { IconButton } from "@tredici";

const Topbar = () => {
  const { dir } = useCurrentDir();

  const minimize = () => appWindow.minimize();
  const toggleMaximize = () => appWindow.toggleMaximize();
  const close = () => appWindow.close();

  return (
    <div
      className={cn(
        "w-full h-8",
        "fixed",
        "flex items-center gap-0",
        "border-b border-b-[--gray-6]",
        "z-30"
      )}
    >
      <span className={cn("flex items-center gap-4")}>
        <TopbarMenu />
        <IconButton variant="ghost" size="sm" icon={<MagnifyingGlassIcon />} />
      </span>

      <div
        className={cn(
          "w-full h-8",
          "flex justify-center items-center",
          "text-sm",
          "cursor-default"
        )}
        data-tauri-drag-region
      >
        {dir.get()}
      </div>

      <div className={cn("flex gap-0")}>
        <TopbarButton icon={<MinusIcon />} onClick={minimize} />
        <TopbarButton icon={<SquareIcon />} onClick={toggleMaximize} />
        <TopbarButton icon={<Cross1Icon />} onClick={close} danger />
      </div>
    </div>
  );
};

export { Topbar };
