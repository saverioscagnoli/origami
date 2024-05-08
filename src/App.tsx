import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCurrentDir } from "@zustand/current-dir-slice";
import { callstack } from "main";
import { useEffect } from "react";

function App() {
  const [dir, setDir] = useCurrentDir(state => [state.dir, state.setDir]);

  useEffect(() => {
    callstack.push(CommandName.ListDir, { dir: "C:\\" });
  }, []);

  useCommandResponse(CommandName.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      console.error(error);
      callstack.updateStatus(id, CommandStatus.Error);
      return;
    }

    if (isFinished) {
      callstack.updateStatus(id, CommandStatus.Success);

      const [dir, entries] = data!;

      console.log(dir, entries);

      setDir(dir);
      return;
    }
  });
  return (
    <div className="container">
      <h1>Current directory: {dir}</h1>
      <button
        onClick={() =>
          callstack.push(CommandName.ListDir, { dir: "C:\\Users\\Saverio" })
        }
      >
        Change dir
      </button>
    </div>
  );
}

export { App };
