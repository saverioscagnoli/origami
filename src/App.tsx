import { Bottombar } from "@components/bottombar";
import { CreateDialog } from "@components/dialogs";
import { ErrorDialog } from "@components/dialogs/error";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useFrontendEvent } from "@hooks/use-frontend-event";
import { startCommandListeners } from "@lib/command-listeners";
import { startHotkeyListeners } from "@lib/hotkeys";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { emit } from "@tauri-apps/api/event";
import { BasicDirLabel, CommandName, FrontendEvent } from "@typings/enums";
import { useEvent } from "@util-hooks/use-event";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { useSettings } from "@zustand/settings-store";
import { useEffect, useMemo } from "react";

function App() {
  /**
   * Start command listeners.
   */
  startCommandListeners();

  /**
   * Start hotkey listeners
   */
  startHotkeyListeners();

  const [basicDirs, resolveBasicDirs] = useEnvironment(state => [
    state.basicDirs,
    state.resolveBasicdirs
  ]);

  const [theme, setTheme, loadSettings, updateSettings] = useSettings(state => [
    state.theme,
    state.setTheme,
    state.loadSettings,
    state.updateSettings
  ]);

  /**
   * On app start.
   * Reslve basic user directories.
   * Start disk polling.
   */
  useEffect(() => {
    resolveBasicDirs();
    invoke(CommandName.PollDisks);
    invoke(CommandName.LoadCSSModules);
    invoke(CommandName.LoadSettings).then(loadSettings);
  }, []);

  /**
   * When the theme changes in another window,
   * update the theme in this window.
   */
  useFrontendEvent(FrontendEvent.ThemeChange, newTheme => {
    if (theme !== newTheme) {
      updateSettings({ theme: newTheme });
    }
  });

  /**
   * On basic directories resolved (app start).
   * Cd into home directory.
   */
  useEffect(() => {
    const home = basicDirs.find(dir => dir.label === BasicDirLabel.Home);

    if (home) {
      invoke(CommandName.ListDir, { dir: home.path });
    }
  }, [basicDirs]);

  /**
   * Mouse buttons back nad forward.
   */
  const [history, index, goBack, goForward] = useCurrentDir(state => [
    state.history,
    state.historyIndex,
    state.goBack,
    state.goForward
  ]);

  const canGoBack = useMemo(() => index > 0, [index]);
  const canGoForward = useMemo(() => index < history.length - 1, [index]);

  useEvent(
    "mousedown",
    e => {
      if (e.button === 3) {
        if (canGoBack) {
          goBack();
        }
      } else if (e.button === 4) {
        if (canGoForward) {
          goForward();
        }
      }
    },
    [canGoBack, canGoForward]
  );

  /**
   * Emit an event before the app is refreshed or closed.
   * To perform cleanup operations.
   */
  useEvent(window, "beforeunload", () => emit(FrontendEvent.BeforeUnload));

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
    <div className={cn("w-screen h-screen", "select-none")}>
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex gap-0")}
      >
        <Sidebar />
        <>
          <CreateDialog />
          <ErrorDialog />
        </>
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export { App };
