/* In this file there are present document events and backend events that should be setup when the app first loads. */

import { useCurrentDir } from "@hooks/use-current-dir";
import { useDocumentEvent } from "@hooks/use-document-event";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { useWindowEvent } from "@hooks/use-window-event";
import { emit } from "@tauri-apps/api/event";
import { DirEntry } from "@typings/dir-entry";
import { EventFromBackend, EventToBackend } from "@typings/events";
import { EntryMap } from "./entry-map";

function setupFrontendEvents() {
  useDocumentEvent("contextmenu", e => e.preventDefault());
  useWindowEvent("beforeunload", () => emit(EventToBackend.StopEmittingDisks));
}

function setupTauriEvents() {
  const { dir, entries } = useCurrentDir();

  type ActualPayload = [{ [key: string]: DirEntry }, string];
  type FinalPayload = [EntryMap<string, DirEntry>, string];

  useTauriEvent<ActualPayload, FinalPayload>(
    EventFromBackend.DirListed,
    ([newEntries, newDir]) => {
      dir.set(newDir);
      entries.set(newEntries);
    },
    {
      mutate: ([entries, dir]) => [new EntryMap(Object.entries(entries)), dir]
    }
  );

  useTauriEvent<[string, string]>(EventFromBackend.DirListedFail, p => {
    const [path, msg] = p;
    alert(`Error listing directory ${path}: ${msg}`);
  });

  useTauriEvent<string>(EventFromBackend.CssModule, css => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    console.log("CSS module(s) loaded");
  });
}

export { setupFrontendEvents, setupTauriEvents };
