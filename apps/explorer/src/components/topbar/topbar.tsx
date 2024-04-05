import { cn } from "@utils";
import { TopbarButton } from "./topbar-button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
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
import { useHistory } from "@hooks/use-history";

const Topbar = () => {
  const { entries, dir, selected } = useCurrentDir();
  const { searching, searchQuery } = useGlobalStates();
  const { canGoBack, goBack, canGoForward, goForward } = useHistory();

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

      const entry = entries
        .get()
        .find(e => e.name.toLowerCase().includes(searchQuery.get().toLowerCase()));

      if (entry) {
        setTimeout(() => {
          selected.set([entry]);
        }, 30);
      }
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
          <>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<ArrowLeftIcon />}
              disabled={!canGoBack}
              onClick={goBack}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<ArrowRightIcon />}
              disabled={!canGoForward}
              onClick={goForward}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<MagnifyingGlassIcon />}
              onClick={searching.toggle}
            />
          </>
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
