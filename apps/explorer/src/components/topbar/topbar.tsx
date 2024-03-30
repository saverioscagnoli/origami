import { cn } from "@utils";
import { TopbarButtons } from "./topbar-buttons";
import { useDirectory } from "@hooks/use-directory";
import { TopbarMenu } from "./topbar-menu";
import { IconButton, Input } from "@tredici";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { KeyboardEvent, useEffect, useRef } from "react";

const Topbar = () => {
  const {
    dir,
    history,
    historyIndex,
    goBack,
    goForward,
    searching,
    searchTerm
  } = useDirectory();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => searching.set(p => !p);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") {
      toggleSearch();
    }
  };

  const prevSearchingRef = useRef(searching.get());

  useEffect(() => {
    if (searching.get() && !prevSearchingRef.current) {
      searchTerm.set("");
      inputRef.current?.focus();
    }

    prevSearchingRef.current = searching.get();
  }, [searching]);

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
        {searching.get() ? (
          <Input
            className={cn("w-full ", "ml-1")}
            size="sm"
            value={searchTerm.get()}
            onValueChange={searchTerm.set}
            onBlur={toggleSearch}
            spellCheck={false}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        ) : (
          <>
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

            <IconButton
              variant="ghost"
              icon={<MagnifyingGlassIcon />}
              size="sm"
              onClick={toggleSearch}
            />
          </>
        )}
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
