import { CreateEntry } from "@wails/go/fs/Filesystem";
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState
} from "react";
import { Dialog, Input } from "~/components/tredici";
import { getIconFromExtension } from "~/lib/file-icon-map";
import { cn } from "~/lib/utils";
import { useDir } from "~/stores/dir";
import { useEnv } from "~/stores/env";
import { useCreating } from "~/stores/states";
import { FolderIcon } from "../icons";

const CreateDialog: React.FC = () => {
  const [name, setName] = useState("");
  const sep = useEnv(s => s.sep);
  const dir = useDir(s => s.dir);
  const [creating, isDir, setCreating] = useCreating(s => [
    s.state,
    s.isDir,
    s.set
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the dialog is opened.
  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setCreating({ state: false });
    }

    setName("");
  };

  const onKeyDown: KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      if (name !== "") {
        setName("");
        CreateEntry([dir, name].join(sep), isDir);
      }

      setCreating({ state: false });
    }
  };

  return (
    <Dialog open={creating} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn("w-1/3")}>
        <Dialog.Title>New {isDir ? "Folder" : "File"}</Dialog.Title>
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

export { CreateDialog };
