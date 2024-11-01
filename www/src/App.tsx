import {
  DesktopIcon,
  DiscIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon,
  VideoIcon
} from "@radix-ui/react-icons";
import { useEvent } from "@util-hooks/use-event";
import { FetchConfigDir, FetchKnownFolders } from "@wails/go/fs/Filesystem";
import { Sep } from "@wails/go/utils/Utils";
import { WindowShow } from "@wails/runtime/Runtime";
import { useEffect, useRef } from "react";
import { Sidebar } from "~/components/sidebar";
import { Topbar } from "~/components/topbar";
import { Workspace } from "~/components/workspace";
import { cn } from "~/lib/utils";
import { watchTheme } from "~/stores/config";
import { useDir, watchDir } from "~/stores/dir";
import { useEnv } from "~/stores/env";
import { Botbar } from "./components/botbar";
import { CreateDialog } from "./components/dialogs/create";
import {
  hotkeyDelete,
  hotkeyNewFile,
  hotkeyNewFolder,
  hotkeyReload,
  hotkeySelectAll,
  hotkeyShowCheckboxes,
  hotkeyShowHidden,
  hotkeyToggleTheme,
  hotkeyToggleView
} from "./hotkeys";

function App() {
  const cd = useDir(s => s.cd);
  const setEnv = useEnv(s => s.set);

  /**
   * On startup:
   * - Cd into the default directory
   * - Show the window (so that a white screen is not shown when the webview is loading)
   * - Fetch known folders (desktop, documents, downloads, etc)
   * - Fetch the os' path separator
   */
  useEffect(() => {
    Promise.all([cd("C:"), FetchKnownFolders(), Sep(), FetchConfigDir()]).then(
      ([_, folders, sep, configDir]) => {
        WindowShow();
        setEnv({
          knownFolders: [
            { name: "Starred", path: folders[0], icon: <StarFilledIcon /> },
            { name: "Home", path: folders[1], icon: <HomeIcon /> },
            { name: "Desktop", path: folders[2], icon: <DesktopIcon /> },
            { name: "Downloads", path: folders[3], icon: <DownloadIcon /> },
            { name: "Documents", path: folders[4], icon: <ReaderIcon /> },
            { name: "Pictures", path: folders[5], icon: <ImageIcon /> },
            { name: "Music", path: folders[6], icon: <DiscIcon /> },
            { name: "Videos", path: folders[7], icon: <VideoIcon /> }
          ],
          sep,
          configDir
        });
      }
    );
  }, []);

  /**
   * Internally uses an useEffect that watches
   * the theme states from the stores, and applies changes to the DOM
   * @see ~/stores/*
   */
  watchTheme();
  watchDir();

  /**
   * Setup all the hotkey handlers
   */
  hotkeyDelete();
  hotkeyNewFile();
  hotkeyNewFolder();
  hotkeyReload();
  hotkeySelectAll();
  hotkeyShowCheckboxes();
  hotkeyShowHidden();
  hotkeyToggleTheme();
  hotkeyToggleView();

  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Prevents the zooming of the page when the user scrolls
   * with control key pressed
   */
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
        className={cn("w-full h-[calc(100vh-3.25rem)]", "fixed top-7", "flex")}
      >
        <>
          <CreateDialog />
        </>
        <Sidebar />
        <Workspace />
      </div>
      <Botbar />
    </div>
  );
}

export { App };
