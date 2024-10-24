import { KeyboardEventHandler, useEffect, useRef } from "react";
import { Input } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { useStates } from "~/zustand/states";

const SearchInput = () => {
  const [searching, setSearching] = useStates(s => [
    s.searching,
    s.setSearching
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Focus the input when searching is active.
   */
  useEffect(() => {
    if (searching.state) {
      inputRef.current?.focus();
    }
  }, [searching]);

  /**
   * Reset the state, but not the query.
   */
  const stopSearching = () => {
    setSearching({ state: false });
  };

  const onKeyDown: KeyboardEventHandler = e => {
    switch (e.key) {
      case "Enter": {
        stopSearching();

        if (searching.where === "everywhere" && searching.query !== "") {
        }

        break;
      }
      case "Escape": {
        stopSearching();
        break;
      }
    }
  };

  const onValueChange = (query: string) => {
    setSearching({ query });
  };

  return (
    <Input
      id="topbar-search-input"
      size="sm"
      className={cn("!w-64", "!font-normal")}
      spellCheck={false}
      autoComplete="off"
      value={searching.query}
      //@ts-ignore
      onValueChange={onValueChange}
      onKeyDown={onKeyDown}
      onBlur={stopSearching}
      ref={inputRef}
    />
  );
};

export { SearchInput };
