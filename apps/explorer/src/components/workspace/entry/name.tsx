import { FolderIcon } from "@components/folder-icon";
import { fileIconMap } from "@lib/file-icon-map";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type EntryNameProps = {
  path: string;
  name: string;
  isDir: boolean;
  isRenaming: boolean;
  create: (name: string, isDir: boolean) => void;
  stopCreating: () => void;
  rename: (newName: string) => void;
  stopRenaming: () => void;
};

const EntryName: FC<EntryNameProps> = ({
  path,
  name,
  isDir,
  isRenaming,
  create,
  stopCreating,
  rename,
  stopRenaming
}) => {
  const [fileName, setFileName] = useState<string>(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCreating = useMemo(() => isRenaming && path === "", [isRenaming]);

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
    if (isCreating) {
      stopCreating();
    } else {
      stopRenaming();
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      if (isCreating) {
        create(fileName, isDir);
      } else {
        rename(fileName);
      }
    }
  };

  return (
    <span className={cn("flex items-center gap-1.5")}>
      <span className={cn("min-w-4")}>
        {isDir ? (
          <FolderIcon />
        ) : (
          fileIconMap.get(fileName.split(".").pop().toLowerCase()) ?? <FileIcon />
        )}
      </span>
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
