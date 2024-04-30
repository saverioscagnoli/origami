import { Disk } from "@typings/disk";
import { EventFromBackend } from "@typings/events";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type EventMap = {
  [EventFromBackend.SendDisks]: Disk[];
};

const useTauriEvent = buildMappedTauriEventHook<EventMap>();

export { useTauriEvent };
