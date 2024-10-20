import { useEvent } from "@util-hooks/use-event";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { Sep } from "@wails/methods/fs/Filesystem";
import { useEffect } from "react";
import { Bottombar } from "~/components/bottombar";
import { CreateEntryDialog } from "~/components/dialogs/create-entry";
import { Sidebar } from "~/components/sidebar";
import { Topbar } from "~/components/topbar";
import { Workspace } from "~/components/workspace";
import { useWailsEvent } from "~/hooks/use-wails-events";
import {
  hotkeyDelete,
  hotkeyFileDialog,
  hotkeyFolderDialog,
  hotkeyReload,
  hotkeyRenameEntry,
  hotkeySelectAllEntries,
  hotkeyToggleShowCheckboxes,
  hotkeyToggleShowHidden,
  hotkeyToggleTheme,
  hotkeyToggleView
} from "~/hotkeys";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { useSettings } from "~/zustand/settings";

function App() {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);
  const setSep = useEnv(s => s.setSep);
  const theme = useSettings(s => s.theme);

  /**
   * On start:
   * - Start the directory watcher to detect changes
   * - When the `StartWatching` function is started, it will emit a `watching` event.
   *   This event will be caught and then program will cd into the default directory.
   * - Fetch the path separator from the backend.
   */
  useEffect(() => {
    // StartWatching();
    // StartFetchingDisks();
    Sep().then(setSep);
  }, []);

  /**
   * Listen to the `watching` event and cd into the default directory.
   */
  useWailsEvent("watching", () => cd("C:"));

  /**
   * Setup all the hotkey listeners
   */
  hotkeyDelete();
  hotkeyFileDialog();
  hotkeyFolderDialog();
  hotkeyReload();
  hotkeyRenameEntry();
  hotkeySelectAllEntries();
  hotkeyToggleShowCheckboxes();
  hotkeyToggleShowHidden();
  hotkeyToggleTheme();
  hotkeyToggleView();

  /**
   * When the theme state changes, reflect the changes
   */
  useEffect(() => {
    if (
      theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = theme;
    }
  }, [theme]);

  /**
   * Disable The default context menu.
   */
  useEvent("contextmenu", e => e.preventDefault());

  /**
   * Prevent browser default behaviors
   */
  useHotkey([Modifier.Ctrl], Key.G, e => e.preventDefault());
  useHotkey([Modifier.Ctrl], Key.U, e => e.preventDefault());
  useHotkey([Modifier.Ctrl], Key.P, e => e.preventDefault());

  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.G, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.P, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.I, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.R, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.S, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.J, e => e.preventDefault());
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.C, e => e.preventDefault());

  return (
    <div className={cn("w-full h-full", "flex flex-col", "select-none")}>
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex")}
      >
        <>
          <CreateEntryDialog />
        </>
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export default App;
