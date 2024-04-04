import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useJSEvent } from "@hooks/use-js-event";
import { useNavigation } from "@hooks/use-navigation";
import { onMount } from "@life-cycle";
import { homeDir } from "@tauri-apps/api/path";
import { cn } from "@utils";

function App() {
  const { changeDir } = useNavigation();
  const { selected } = useCurrentDir();
  const { renaming } = useGlobalStates();

  onMount(async () => {
    let home = await homeDir();
    changeDir(home)();
  });

  useJSEvent("keydown", [renaming.get()], e => {
    if (e.key === "F2") {
      const entry = selected.get().at(0);
      renaming.set(entry);
    }
  });

  return (
    <div className={cn("select-none")}>
      <Topbar />
      <div
        className={cn(
          "w-full h-[calc(100vh-3.5rem)]",
          "fixed",
          "flex gap-0",
          "mt-8"
        )}
      >
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export { App };
