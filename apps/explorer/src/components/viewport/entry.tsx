import React, { ReactNode, useEffect, useRef } from "react";
import { cn } from "@utils";
import {
  ArchiveIcon,
  CubeIcon,
  DiscIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon
} from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { DirEntry } from "@types";
import { BsFolderFill } from "react-icons/bs";
import { useEntryContext } from "@hooks/use-entry-context";
import { renameFile } from "@tauri-apps/api/fs";

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

const Entry: React.FC<DirEntry> = ({ name, path, is_folder }) => {
  const { dir, read, history } = useDirectory();
  const { renaming } = useEntryContext();

  const nameRef = useRef<HTMLParagraphElement>(null);

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

  const onClick = () => {
    if (!is_folder) return;

    dir.set(path);

    history.set(p => [...p, path.split("\\").slice(0, -1).join("\\")]);
    read(path);
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "flex items-center gap-4",
        "px-4",
        "text-sm",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        "select-none"
      )}
      onClick={onClick}
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
    </div>
  );
};

export { Entry };
