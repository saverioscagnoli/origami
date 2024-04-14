import { Modifier } from "@typings/modifier";
import { DependencyList } from "react";
import { useDocumentEvent } from "./use-document-event";

function useHotkey(
  mods: Modifier[],
  key: string,
  cb: (e: KeyboardEvent) => void,
  deps: DependencyList = []
) {
  useDocumentEvent(
    "keydown",
    e => {
      if (mods.every(mod => e[mod]) && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        e.stopPropagation();

        cb(e);
      }
    },
    deps
  );
}

export { useHotkey };
