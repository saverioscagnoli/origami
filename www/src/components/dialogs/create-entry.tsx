import { CreateEntry } from "@wails/methods/fs/Filesystem";
import React, { useEffect, useRef, useState } from "react";
import { FolderIcon } from "~/components/icons/folder";
import { Dialog, Input } from "~/components/tredici";
import { getIconFromExtension } from "~/lib/file-icon-map";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { useStates } from "~/zustand/states";

const CreateEntryDialog: React.FC = () => {
  const [name, setName] = useState<string>("");

  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);
  const sep = useEnv(s => s.sep);
  const [{ state, isDir }, setCreating] = useStates(s => [
    s.creating,
    s.setCreating
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the dialog is opened.
  useEffect(() => {
    if (state) {
      inputRef.current?.focus();
    }
  }, [state]);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setCreating({ state: false });
    }

    setName("");
  };

  const onKeyDown: React.KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      if (name !== "") {
        setName("");
        CreateEntry([dir, name].join(sep), isDir);
      }

      setCreating({ state: false });
    }
  };

  return (
    <Dialog open={state} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn("w-1/3")}>
        <Dialog.Title>Create {isDir ? "Folder" : "File"}</Dialog.Title>
        <div className={cn("flex items-center gap-4", "mt-2")}>
          <span className={cn("w-10 h-10")}>
            {isDir ? (
              <FolderIcon className={cn("w-full h-full")} />
            ) : (
              React.cloneElement(getIconFromExtension(name.split(".").pop()), {
                className: cn("w-full h-full")
              })
            )}
          </span>
          <Input
            className={cn("w-full", "font-semibold")}
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

export { CreateEntryDialog };
