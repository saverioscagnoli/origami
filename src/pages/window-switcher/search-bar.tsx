import { useEvent } from "@hooks";
import { BackendEvent, KeyEvent, Process } from "@lib";
import { Accessor, Component, Setter } from "solid-js";

interface SearchBarProps {
  search: Accessor<string>;
  setSearch: Setter<string>;
  setProcesses: Setter<Process[]>;
}

const SearchBar: Component<SearchBarProps> = ({
  search,
  setSearch,
  setProcesses
}) => {
  let inputRef: HTMLInputElement;

  useEvent<Process[]>(BackendEvent.ShowWindowSwitcher, p => {
    inputRef.focus();
    setProcesses(p);
  });

  useEvent<Process[]>(BackendEvent.SendProcesses, (p) => {
    setProcesses(p);
  })

  useEvent(BackendEvent.HideWindowSwitcher, () => {
    setSearch("");
  });

  const onSearch = (e: KeyEvent) => {
    let val = e.target.value;
    setSearch(val);
  };

  return (
    <div class="w-full h-16 flex items-center p-2">
      <p class="ml-1">{">"}</p>
      <input
        ref={inputRef!}
        class="!w-full !p-2"
        spellcheck={false}
        style={{ all: "unset" }}
        value={search()}
        onInput={onSearch}
      />
    </div>
  );
};

export { SearchBar };
