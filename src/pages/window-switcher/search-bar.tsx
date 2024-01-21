import { useEvent } from "@hooks";
import { BackendEvent, Process } from "@lib";
import { Component, Setter } from "solid-js";

interface SearchBarProps {
  setProcesses: Setter<Process[]>;
}

const SearchBar: Component<SearchBarProps> = ({ setProcesses }) => {
  let inputRef: HTMLInputElement;

  useEvent<Process[]>(BackendEvent.ShowWindowSwitcher, p => {
    inputRef.focus();
    setProcesses(p);
  });

  return (
    <div class="w-full h-16 flex p-2">
      <input
        ref={inputRef!}
        class="!w-full !p-2"
        spellcheck={false}
        style={{ all: "unset" }}
      />
    </div>
  );
};

export { SearchBar };
