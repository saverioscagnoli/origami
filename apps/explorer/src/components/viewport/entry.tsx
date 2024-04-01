import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import { cn } from "@utils";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CodeIcon,
  CrumpledPaperIcon,
  CubeIcon,
  DiscIcon,
  EyeOpenIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  GlobeIcon,
  ImageIcon,
  MixerVerticalIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { BsFolderFill } from "react-icons/bs";
import { useEntryContext } from "@hooks/use-entry-context";
import { renameFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api";
import { LuMusic, LuKey, LuLibrary } from "react-icons/lu";

const fileIconMap = new Map<string, ReactNode>([
  ["txt", <FileTextIcon />],
  ["log", <FileTextIcon />],
  ["jpg", <ImageIcon />],
  ["jpeg", <ImageIcon />],
  ["png", <ImageIcon />],
  ["gif", <ImageIcon />],
  ["webp", <ImageIcon />],
  ["svg", <ImageIcon />],
  ["ico", <ImageIcon />],
  ["zip", <ArchiveIcon />],
  ["rar", <ArchiveIcon />],
  ["7z", <ArchiveIcon />],
  ["tar", <ArchiveIcon />],
  ["gz", <ArchiveIcon />],
  ["mp3", <LuMusic />],
  ["wav", <LuMusic />],
  ["ogg", <LuMusic />],
  ["exe", <CubeIcon />],
  ["bin", <CubeIcon />],
  ["msi", <CubeIcon />],
  ["iso", <DiscIcon />],
  ["appimage", <CubeIcon />],
  ["key", <LuKey />],
  ["ppk", <LuKey />],
  ["env", <GlobeIcon />],
  ["dll", <LuLibrary />],
  ["xml", <CodeIcon />],
  ["html", <CodeIcon />],
  ["ini", <MixerVerticalIcon />],
  ["config", <MixerVerticalIcon />],
  ["sys", <GearIcon />],
  ["tmp", <CrumpledPaperIcon />]
]);

type EntryProps = {
  style: CSSProperties;
  index: number;
};

const Entry: React.FC<EntryProps> = ({ style, index }) => {
  const [creating, setCreating] = useState<boolean>(false);
  const { entries, dir, reload, changeDir, selected } = useDirectory();
  const { renaming, entry } = useEntryContext();
  const {
    name,
    path,
    is_folder,
    is_hidden,
    last_modified,
    size,
    is_symlink,
    is_starred
  } = entry;

  const nameRef = useRef<HTMLParagraphElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    entryRef.current.addEventListener("dblclick", () => {
      if (is_folder) {
        changeDir(path);
      } else {
        invoke("open_file", { path });
      }
    });
  }, []);

  useEffect(() => {
    if (entries.get().at(-1).name === "") {
      renaming.set(true);
      setCreating(true);
    }
  }, [entries.get()]);

  useEffect(() => {
    if (renaming.get()) {
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.focus();

          const text = nameRef.current.firstChild;
          const range = document.createRange();

          range.selectNodeContents(text);

          const end =
            name.lastIndexOf(".") === -1 ? name.length : name.lastIndexOf(".");

          range.setStart(text, 0);
          range.setEnd(text, end);

          const sel = window.getSelection();

          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 10);
    }
  }, [renaming.get()]);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.ctrlKey) {
      selected.set([...selected.get(), entry]);
    } else {
      selected.set([entry]);
    }
  };

  return (
    <div
      data-indx={index}
      ref={entryRef}
      className={cn(
        "w-full h-6",
        "flex items-center gap-4",
        "px-4",
        "text-sm",
        renaming.get() ? "cursor-text" : "cursor-pointer",
        "hover:bg-[--gray-3]",
        selected.get().some(e => e.path === path) && "bg-[--gray-4]",
        "select-none"
      )}
      onClick={onClick}
      style={style}
    >
      {is_folder ? (
        <BsFolderFill />
      ) : (
        fileIconMap.get(name.split(".").pop().toLowerCase()) ?? <FileIcon />
      )}
      <p
        ref={nameRef}
        contentEditable={renaming.get()}
        spellCheck={false}
        onBlur={() => {
          renaming.set(false);
          setCreating(false);
        }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();

            if (!creating) {
              renaming.set(false);
              renameFile(
                path,
                path.replace(
                  name,
                  e.currentTarget.textContent === ""
                    ? is_folder
                      ? "New Folder"
                      : "File"
                    : e.currentTarget.textContent
                )
              ).then(() => {
                reload();
              });
            } else {
              invoke("create_entry", {
                dir: dir.get(),
                name: e.currentTarget.textContent,
                isFolder: is_folder
              }).then(() => {
                reload();
              });
            }

            setCreating(false);
          }
        }}
        className={cn(
          "w-44",
          !renaming.get() && ["text-ellipsis", "overflow-hidden"],
          "whitespace-nowrap",
          "rounded-sm",
          "outline-none"
        )}
        suppressContentEditableWarning
      >
        {name}
      </p>
      <span className={cn("w-1", "mr-2")}>
        {is_starred && <StarFilledIcon />}
      </span>
      <span className={cn("w-1", "mr-2")}>
        {is_symlink && <ArrowLeftIcon />}
      </span>
      <span className={cn("w-1")}>{is_hidden && <EyeOpenIcon />}</span>
      <p className={cn("w-44", "text-[--gray-10]", "pl-8")}>{last_modified}</p>
      {!is_folder && <p className={cn("text-[--gray-10]", "pl-4")}>{size}</p>}
    </div>
  );
};

export { Entry };
