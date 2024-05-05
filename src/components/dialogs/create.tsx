import { Dialog, Input } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from "react";

const CreateDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");

  const { dir } = useCurrentDir();
  const { createEntry } = useCommands();

  const { creating, setCreating } = useGlobalStates();
  const { state: open, isDir } = useMemo(
    () => creating || { state: false, isDir: false },
    [creating]
  );

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setCreating(null);
    }
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") {
      createEntry(dir + sep() + name, isDir);
      setName("");
      setCreating(null);
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
