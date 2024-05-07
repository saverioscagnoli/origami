import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCurrentDir } from "@contexts/current-dir";
import { useCommand } from "@hooks/use-command";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/enums";
import { onMount } from "solid-js";

function App() {
  const { setDir, setEntries } = useCurrentDir();

  useCommand(Command.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      alert(error);
      return;
    }

    if (isFinished) {
      const [dir, entries] = data!;

      setDir(dir);
      setEntries(entries);
    }
  });

  onMount(() => {
    invoke(Command.ListDir, { dir: "C:\\" });
  });

  return (
    <div id="wrapper">
      <Topbar />
      <Bottombar />
      <div id="workspace-wrapper">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
}

export default App;
