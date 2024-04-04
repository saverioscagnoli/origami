import React, { KeyboardEventHandler, useMemo, useRef } from "react";
import { cn } from "@utils";
import { fileIconMap } from "lib/file-icons";
import { FileIcon } from "@radix-ui/react-icons";
import { useGlobalStates } from "@hooks/use-global-states";
import { useAccessor } from "@hooks/use-accessor";
import { whenChanges } from "@life-cycle";
import { Input } from "@components/tredici";
import { LuFolder } from "react-icons/lu";
import { useNavigation } from "@hooks/use-navigation";

type EntryNameProps = {
  name: string;
  is_folder: boolean;
};

const EntryName: React.FC<EntryNameProps> = ({ name, is_folder }) => {
  const { renaming } = useGlobalStates();
  const { rename } = useNavigation();

  const inputRef = useRef<HTMLInputElement>(null);
  const inputValue = useAccessor<string>(name);

  whenChanges([name], () => inputValue.set(name));

  const isTarget = useMemo(() => renaming.get()?.name === name, [renaming.get()]);

  whenChanges([renaming.get()], () => {
    if (isTarget) {
      setTimeout(() => {
        const extensionLength = inputValue.get().split(".").pop()?.length || 0;
        const endPosition =
          inputValue.get().length - (extensionLength ? extensionLength + 1 : 0);
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(0, endPosition);
      }, 10);
    }
  });

  const onKeyDown: KeyboardEventHandler = async e => {
    if (e.key === "Enter") {
      renaming.reset();
      inputValue.set(name);

      await rename(inputValue.get());

      setTimeout(() => {
        inputRef.current?.blur();
      }, 10);
    }
  };

  return (
    <span className={cn("flex items-center gap-0.5")} draggable>
      <span className="min-w-4">
        {is_folder ? (
          <LuFolder fill="var(--slate-12)" />
        ) : (
          fileIconMap.get(inputValue.get().split(".").pop().toLowerCase()) ?? (
            <FileIcon />
          )
        )}
      </span>
      <Input
        className={cn(
          "h-full",
          "!font-normal",
          "rounded-sm",
          "border-none shadow-none",
          "selection:bg-[--plum-7]",
          "truncate",
          !isTarget && "pointer-events-none"
        )}
        value={inputValue.get()}
        spellCheck={false}
        onValueChange={inputValue.set}
        onKeyDown={onKeyDown}
        onBlur={() => {
          renaming.reset();
          inputValue.set(name);
        }}
        ref={inputRef}
      />
    </span>
  );
};

export { EntryName };
