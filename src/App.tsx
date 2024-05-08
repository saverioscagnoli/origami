import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCallstack } from "@contexts/callstack";
import { useCurrentDir } from "@contexts/current-dir";
import { useCommand } from "@hooks/use-command";
import { CommandName, CommandStatus } from "@typings/enums";
import { onMount } from "solid-js";

function App() {
  const { push, updateStatus } = useCallstack();
  const { setDir, setEntries } = useCurrentDir();

  onMount(() => {
    push(CommandName.ListDir, { dir: "C:\\" });
  });

  useCommand(CommandName.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      updateStatus(id, CommandStatus.Error);
      alert(error.message);
      return;
    }

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);
      const [dir, entries] = data!;

      setDir(dir);
      setEntries(entries);
    }
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
