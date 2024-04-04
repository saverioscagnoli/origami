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
import { IconButton, Input } from "@tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { KeyboardEventHandler, useRef } from "react";
import { whenChanges } from "@life-cycle";

const Topbar = () => {
  const { dir } = useCurrentDir();
  const { searching, searchQuery } = useGlobalStates();

  const inputRef = useRef<HTMLInputElement>(null);

  const minimize = () => appWindow.minimize();
  const toggleMaximize = () => appWindow.toggleMaximize();
  const close = () => appWindow.close();

  whenChanges([searching.get()], () => {
    if (searching.get()) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  });

  const onKeyDown: KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      searching.toggle();
    }
  };

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
        {searching.get() ? (
          <Input
            className={cn("!h-[22px]")}
            size="sm"
            spellCheck={false}
            onKeyDown={onKeyDown}
            onBlur={searching.toggle}
            value={searchQuery.get()}
            onValueChange={searchQuery.set}
            ref={inputRef}
          />
        ) : (
          <IconButton
            variant="ghost"
            size="sm"
            icon={<MagnifyingGlassIcon />}
            onClick={searching.toggle}
          />
        )}
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
