import { useEvent } from "@util-hooks/use-event";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import {
  GetConfig,
  GetConfigDir,
  LoadCustomCSS
} from "@wails/methods/config/Config";
import { OsName, Sep } from "@wails/methods/utils/Utils";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Bottombar } from "~/components/bottombar";
import { CreateEntryDialog } from "~/components/dialogs/create-entry";
import { Sidebar } from "~/components/sidebar";
import { Topbar } from "~/components/topbar";
import { Workspace } from "~/components/workspace";
import {
  hotkeyCopy,
  hotkeyCut,
  hotkeyDelete,
  hotkeyFileDialog,
  hotkeyFolderDialog,
  hotkeyParentDir,
  hotkeyPaste,
  hotkeyReload,
  hotkeyRenameEntry,
  hotkeySearchHere,
  hotkeySelectAllEntries,
  hotkeyToggleShowCheckboxes,
  hotkeyToggleShowHidden,
  hotkeyToggleTheme,
  hotkeyToggleView
} from "~/hotkeys";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { settingsEffect, Theme, useSettings, View } from "~/zustand/settings";

function App() {
  const cd = useCurrentDir(s => s.cd);
  const [setSep, setOs, setConfigDir] = useEnv(s => [
    s.setSep,
    s.setOs,
    s.setConfigDir
  ]);

  const [
    theme,
    setTheme,
    setShowHidden,
    setShowCheckboxes,
    setView,
    setFilter
  ] = useSettings(s => [
    s.theme,
    s.setTheme,
    s.setShowHidden,
    s.setShowCheckboxes,
    s.setView,
    s.setFilter
  ]);

  /**
   * On start:
   * - Load the config from the backend.
   * - Fetch the path separator from the backend.
   * - Fetch the OS name from the backend.
   * - Cd into the default directory.
   */
  useLayoutEffect(() => {
    Promise.all([
      GetConfig(),
      Sep(),
      OsName(),
      GetConfigDir(),
      LoadCustomCSS()
    ]).then(([config, sep, osName, configDir, css]) => {
      setTheme(config.theme as Theme);
      setShowHidden(config.showHidden);
      setShowCheckboxes(config.showCheckboxes);
      setView(config.view as View);
      setFilter(config.filter);
      setSep(sep);
      setConfigDir(configDir);
      setOs(osName);

      /**
       * Inject the custom css into the head of the document.
       * TODO: Actually check if the css is valid.
       * also, this sketchy af.
       */
      if (css) {
        for (const style of css) {
          const styleElement = document.createElement("style");
          styleElement.innerHTML = style;
          document.head.appendChild(styleElement);
        }
      }
    });

    cd("C:");
  }, []);

  /**
   * Setup all the hotkey listeners
   */
  hotkeyCopy();
  hotkeyCut();
  hotkeyDelete();
  hotkeyFileDialog();
  hotkeyFolderDialog();
  hotkeyParentDir();
  hotkeyPaste();
  hotkeyReload();
  hotkeyRenameEntry();
  hotkeySearchHere();
  hotkeySelectAllEntries();
  hotkeyToggleShowCheckboxes();
  hotkeyToggleShowHidden();
  hotkeyToggleTheme();
  hotkeyToggleView();

  /**
   * Watch for changes in the settings with useEffects
   */
  settingsEffect();

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

  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Prevent zooming in/out with ctrl + scroll
   */
  // @ts-ignore
  useEvent(wrapperRef, "wheel", e => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  });

  return (
    <div
      className={cn("w-full h-full", "flex flex-col", "select-none")}
      ref={wrapperRef}
    >
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
