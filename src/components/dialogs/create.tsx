import { FolderIcon } from "@components/icons";
import { Dialog, Input } from "@components/tredici";
import { fileIconMap } from "@lib/file-icon-map";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import { join } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

const CreateDialog = () => {
  const [name, setName] = useState<string>("");

  const dir = useCurrentDir(state => state.dir);
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
      if (name !== "") {
        const path = await join(dir, name);
        invoke(CommandName.CreateEntry, { path, isDir });
        setName("");
      }

      setCreating({ state: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn("w-1/3")}>
        <Dialog.Title>Create {isDir ? "Folder" : "File"}</Dialog.Title>
        <div className={cn("flex items-center gap-4", "mt-2")}>
          <span className={cn("w-10 h-10")}>
            {isDir ? (
              <FolderIcon className={cn("w-full h-full")} />
            ) : (
              fileIconMap.get(name.split(".").pop() ?? "") ?? (
                <FileIcon className={cn("w-full h-full")} />
              )
            )}
          </span>
          <Input
            className={cn("w-full", "font-normal")}
            spellCheck={false}
            autoComplete="off"
            value={name}
            onValueChange={setName}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { CreateDialog };
