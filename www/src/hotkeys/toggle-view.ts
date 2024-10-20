import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "~/zustand/settings";

/**
 * Ctrl + L toggles the view between list and grid.
 * Only affects workspace view.
 */
function hotkeyToggleView() {
  const [view, setView] = useSettings(s => [s.view, s.setView]);

  useHotkey(
    [Modifier.Ctrl],
    Key.L,
    () => {
      setView(view === "list" ? "grid" : "list");
    },
    [view]
  );
}

export { hotkeyToggleView };
