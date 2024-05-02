import { Dialog, Input } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { KeyboardEventHandler, useMemo, useRef } from "react";

const CreateDialog= () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const name = useAccessor<string>("");

  const { dir } = useCurrentDir();
  const { createEntry } = useDispatchers();

  const { creating } = useGlobalStates();
  const { state, isDir } = useMemo(() => creating(), [creating()]);

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") {
      createEntry(dir + sep() + name(), isDir);
      name.reset();
      creating.reset();
    }
  };

  return (
    <Dialog
      open={state}
      onOpenChange={state => (state ? inputRef.current?.focus() : creating.reset())}
    >
      <Dialog.Content className={cn("w-1/3")}>
        <Dialog.Title>Create {isDir ? "Folder" : "File"}</Dialog.Title>
        <Input
          className={cn("mt-2", "font-normal")}
          value={name()}
          spellCheck={false}
          onValueChange={name.set}
          onKeyDown={onKeyDown}
        />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { CreateDialog };
