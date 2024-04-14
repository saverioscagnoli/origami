import { FolderIcon } from "@components/folder-icon";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState
} from "react";

type EntryNameProps = {
  name: string;
  isDir: boolean;
  isRenaming: boolean;
  rename: (newName: string) => void;
  stopRenaming: () => void;
};

const EntryName: FC<EntryNameProps> = ({
  name,
  isDir,
  isRenaming,
  rename,
  stopRenaming
}) => {
  const [fileName, setFileName] = useState<string>(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => {
        const input = inputRef.current;

        if (input) {
          input.focus();
          const lastDotIndex = input.value.lastIndexOf(".");
          if (lastDotIndex > 0) {
            input.setSelectionRange(0, lastDotIndex);
          } else {
            input.select();
          }
        }
      }, 20);
    }
  }, [isRenaming]);

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFileName(e.currentTarget.value);
  };

  const onBlur = () => {
    inputRef.current?.blur();
    setFileName(name);
    stopRenaming();
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      rename(fileName);
    }
  };

  return (
    <span className={cn("flex items-center gap-1.5")}>
      <span className={cn("min-w-4")}>{isDir ? <FolderIcon /> : <FileIcon />}</span>
      <input
        className={cn(
          "bg-transparent",
          "outline-none",
          "rounded",
          "selection:bg-[--plum-6]",
          isRenaming
            ? ["ring-[1.5px] ring-[--plum-9]", "px-1"]
            : ["truncate", "pointer-events-none"]
        )}
        spellCheck={false}
        value={fileName}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </span>
  );
};

export { EntryName };
