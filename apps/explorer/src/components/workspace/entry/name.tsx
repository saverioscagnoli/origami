import { FolderIcon } from "@components/folder-icon";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import { FC, KeyboardEventHandler, useEffect, useRef } from "react";

type EntryNameProps = {
  name: string;
  isDir: boolean;
  isRenaming: boolean;
  stopRenaming: () => void;
};

const EntryName: FC<EntryNameProps> = ({
  name,
  isDir,
  isRenaming,
  stopRenaming
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isRenaming]);

  const onBlur = () => {
    inputRef.current?.blur();
    stopRenaming();
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      onBlur();
    }
  };

  return (
    <span className={cn("flex items-center gap-1.5")}>
      <span className={cn("min-w-4")}>{isDir ? <FolderIcon /> : <FileIcon />}</span>
      <input
        className={cn(
          "bg-transparent",
          !isRenaming && ["truncate", "pointer-events-none"]
        )}
        defaultValue={name}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </span>
  );
};

export { EntryName };
