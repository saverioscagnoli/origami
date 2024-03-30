import React, { CSSProperties, ReactNode, useEffect, useRef } from "react";
import { cn } from "@utils";
import {
  ArchiveIcon,
  CubeIcon,
  DiscIcon,
  EyeOpenIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon
} from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { BsFolderFill } from "react-icons/bs";
import { useEntryContext } from "@hooks/use-entry-context";
import { renameFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api";

const fileIconMap = new Map<string, ReactNode>([
  ["txt", <FileTextIcon />],
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
  ["mp3", <DiscIcon />],
  ["wav", <DiscIcon />],
  ["ogg", <DiscIcon />],
  ["exe", <CubeIcon />],
  ["msi", <CubeIcon />],
  ["appImage", <CubeIcon />]
]);

const Entry: React.FC<{ style: CSSProperties }> = ({ style }) => {
  const { dir, read, changeDir, selected } = useDirectory();
  const { renaming, entry } = useEntryContext();
  const {
    name,
    path,
    is_folder,
    is_hidden,
    last_modified,
    size,
    can_be_opened
  } = entry;

  const nameRef = useRef<HTMLParagraphElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);

  if (path.toLowerCase().includes("cookies")) {
    console.log("Cookies directory detected, path: ", path, can_be_opened);
  }

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
        fileIconMap.get(name.split(".").pop()!) ?? <FileIcon />
      )}
      <p
        ref={nameRef}
        contentEditable={renaming.get()}
        spellCheck={false}
        onBlur={() => renaming.set(false)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
            renaming.set(false);
            renameFile(
              path,
              path.replace(name, e.currentTarget.textContent!)
            ).then(() => {
              read(dir.get());
            });
          }
        }}
        className={cn(
          "w-52",
          !renaming.get() && ["text-ellipsis", "overflow-hidden"],
          "whitespace-nowrap",
          "rounded-sm",
          "outline-none"
        )}
        suppressContentEditableWarning
      >
        {name}
      </p>
      {is_hidden && <EyeOpenIcon />}
      <p className={cn("w-44", "text-[--gray-10]", "pl-8")}>{last_modified}</p>
      {!is_folder && <p className={cn("text-[--gray-10]", "pl-4")}>{size}</p>}
    </div>
  );
};

export { Entry };
