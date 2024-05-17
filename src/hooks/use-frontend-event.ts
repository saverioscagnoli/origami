import { getCurrent } from "@tauri-apps/api/window";
import { FrontendEvent } from "@typings/enums";
import { Theme } from "@zustand/settings-store";
import { DependencyList, useEffect } from "react";

type FrontendEventMap = {
  /**
   * This event is emitted when the user tries to reload the app.
   * Cleanup purposes.
   */
  [FrontendEvent.BeforeUnload]: null;

  /**
   * This event is emitted when the theme changes.
   * The payload is the new theme.
   * Used to update theme in other windows
   */
  [FrontendEvent.ThemeChange]: Theme;

  /**
   * This event is emitted when the user cancels a copy operation.
   */
  [FrontendEvent.CancelCopy]: null;
};

function useFrontendEvent<K extends FrontendEvent>(
  event: K,
  cb: (payload: FrontendEventMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const promise = getCurrent().listen<FrontendEventMap[K]>(event, event =>
      cb(event.payload)
    );

    return () => {
      promise.then(dispose => dispose());
    };
  }, deps);
}

export { useFrontendEvent };
