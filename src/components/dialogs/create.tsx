import { Dialog, Input } from "@components/tredici";
import { cn } from "@lib/utils";
import { join } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

const CreateDialog = () => {
  const [name, setName] = useState<string>("");

  const dir = useCurrentDir(state => state.dir);
  const push = useCallstack(state => state.push);
  const [{ state: open, isDir }, setCreating] = useGlobalStates(state => [
    state.creating,
    state.setCreating
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setCreating({ state: false });
      setName("");
    }
  };

  const onKeyDown: KeyboardEventHandler = async e => {
    if (e.key === "Enter") {
      const path = await join(dir, name);
      push(CommandName.CreateEntry, { path, isDir });

      setName("");
      setCreating({ state: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn("w-1/3")}>
        <Dialog.Title>Create {isDir ? "Folder" : "File"}</Dialog.Title>
        <Input
          className={cn("mt-2", "font-normal")}
          spellCheck={false}
          value={name}
          onValueChange={setName}
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { CreateDialog };
