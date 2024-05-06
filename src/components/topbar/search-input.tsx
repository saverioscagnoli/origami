import { Input } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";
import { KeyboardEventHandler, useEffect, useRef } from "react";

const SearchInput = () => {
  const { searching, setSearching } = useGlobalStates();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching.state) {
      inputRef.current?.focus();
    }
  }, [searching]);

  const stopSearching = () => {
    setSearching({ state: false, where: "here", query: searching.query });
  };

  const onKeyDown: KeyboardEventHandler = e => {
    switch (e.key) {
      case "Enter":
      case "Escape": {
        stopSearching();
        break;
      }
    }
  };

  const onValueChange = (query: string) => {
    setSearching({ ...searching, query });
  };

  return (
    <Input
      size="sm"
      className={cn("!w-64")}
      spellCheck={false}
      value={searching.query}
      onValueChange={onValueChange as any}
      onKeyDown={onKeyDown}
      onBlur={stopSearching}
      ref={inputRef}
    />
  );
};

export { SearchInput };
