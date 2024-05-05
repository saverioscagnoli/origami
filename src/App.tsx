import { Bottombar } from "@components/bottombar";
import { CreateDialog, ErrorDialog } from "@components/dialogs";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useEnvironment } from "@hooks/use-environment";
import { useSettings } from "@hooks/use-settings";
import { setupHotkeys } from "@lib/hotkeys";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { emit } from "@tauri-apps/api/event";
import { BasicDirLabel, Command, FrontendEvent } from "@typings/enums";
import { useEvent } from "@util-hooks/use-event";
import { useEffect } from "react";

const App = () => {
  const { cd } = useCurrentDir();
  const { basicDirs } = useEnvironment();

  // Start Polling disks, evert X seconds (see backend consts)
  // So, if the user removes a disk, it will be removed from the sidebar
  useEffect(() => {
    invoke(Command.PollDisks);
  }, []);

  // Cd into the home directory when the app starts
  useEffect(() => {
    const home = basicDirs.find(bd => bd.label === BasicDirLabel.Home);

    if (home) {
      cd(home.path);
    }
  }, [basicDirs]);

  const { theme } = useSettings();

  // Change the theme based on the user's preference
  useEffect(() => {
    document.documentElement.classList.add("light", "dark");

    switch (theme) {
      case "light": {
        document.documentElement.classList.remove("dark");
        break;
      }

      case "dark": {
        document.documentElement.classList.remove("light");
        break;
      }

      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.add("light");
        }
      }
    }
  }, [theme]);

  // Emit an event to cleanup the beckend when the app refreshes
  useEvent(window, "beforeunload", () => emit(FrontendEvent.BeforeUnload, null));

  setupHotkeys();

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "select-none"
        // os() === "linux" && "font-semibold"
      )}
    >
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex gap-0")}
      >
        <>
          <ErrorDialog />
          <CreateDialog />
        </>
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
};

export default App;
