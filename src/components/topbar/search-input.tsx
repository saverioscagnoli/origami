import { Input } from "@components/tredici";
import { cn } from "@lib/utils";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { KeyboardEventHandler, useEffect, useRef } from "react";

const SearchInput = () => {
  const [searching, setSearching] = useGlobalStates(state => [
    state.searching,
    state.setSearching
  ]);

  const setEntries = useCurrentDir(state => state.setEntries);

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

  const onValueChange = async (query: string) => {
    setSearching({ query });
  };

  return (
    <Input
      size="sm"
      className={cn("!w-64")}
      spellCheck={false}
      value={searching.query}
      onValueChange={onValueChange}
      onKeyDown={onKeyDown}
      onBlur={stopSearching}
      ref={inputRef}
    />
  );
};

export { SearchInput };
