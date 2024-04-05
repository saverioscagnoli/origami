import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useEvent } from "@hooks/use-event";
import { useFlags } from "@hooks/use-flags";
import { useGlobalStates } from "@hooks/use-global-states";
import { useJSEvent } from "@hooks/use-js-event";
import { useNavigation } from "@hooks/use-navigation";
import { onMount } from "@life-cycle";
import { invoke } from "@tauri-apps/api";
import { homeDir } from "@tauri-apps/api/path";
import { cn } from "@utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const { changeDir, deleteEntries, open, paste, reload } = useNavigation();
  const { dir, entries, selected } = useCurrentDir();
  const { renaming, searching, searchQuery, creating, clipboardEntries } =
    useGlobalStates();
  const { showHidden } = useFlags();

  onMount(async () => {
    const home = await homeDir();
    changeDir(home)();
  });

  useEvent<string[]>("tauri://file-drop", async p => {
    for (let path of p) {
      await invoke("move_entry", { path, newDir: dir.get() });
    }

    await reload();
  }, [dir.get()]);

  useJSEvent(
    "keydown",
    [renaming.get(), selected.get(), searching.get(), creating.get()],
    async e => {
      if (e.key === "F2") {
        const entry = selected.get().at(0);
        renaming.set(entry);

        return;
      } else if (e.key === "Delete") {
        await deleteEntries();
      }

      if (e.ctrlKey) {
        switch (e.key) {
          case "f": {
            searching.toggle();
            e.preventDefault();
            break;
          }
          case "h": {
            showHidden.toggle();
            e.preventDefault();
            break;
          }
          case "a": {
            if (!renaming.get() && !searching.get()) {
              selected.set(entries.get());
            }
            break;
          }
          case "c": {
            if (!renaming.get() && !searching.get()) {
              clipboardEntries.set([selected.get(), false]);
            }
            break;
          }
          case "x": {
            if (!renaming.get() && !searching.get()) {
              clipboardEntries.set([selected.get(), true]);
            }
            break;
          }
          case "v": {
            if (
              !renaming.get() &&
              !searching.get() &&
              clipboardEntries.get() !== null
            ) {
              await paste();
            }
            break;
          }
        }
      } else if (
        /[a-zA-Z0-9-_ ]/.test(e.key) &&
        e.key.length === 1 &&
        !renaming.get() &&
        !searching.get() &&
        !creating.get()
      ) {
        searchQuery.set(e.key);
        searching.set(true);
      } else if (
        e.key === "Enter" &&
        !renaming.get() &&
        !searching.get() &&
        !creating.get()
      ) {
        if (selected.get().length === 1) {
          const entry = selected.get().at(0);
          await open(entry)();
          //selected.set([entries.get().at(0)]);
        }
      }
    }
  );

  useJSEvent("contextmenu", [], e => {
    e.preventDefault();
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
        <DndProvider backend={HTML5Backend}>
          <Workspace />
        </DndProvider>
      </div>
      <Bottombar />
    </div>
  );
}

export { App };
