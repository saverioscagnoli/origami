import { Entry as EntryT } from "@types";
import { cn } from "@utils";
import React, { useMemo } from "react";
import { EntryName } from "./entry-name";
import { EntryFlagsIcons } from "./entry-flags-icons";
import { EntryDate } from "./entry-date";
import { EntrySize } from "./entry-size";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { startDrag } from "@crabnebula/tauri-plugin-drag";

type EntryProps = EntryT & {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Entry: React.FC<EntryProps> = ({
  name,
  path,
  is_folder,
  is_hidden,
  is_symlink,
  is_starred,
  last_modified,
  size,
  onClick,
  onDoubleClick,
  onContextMenu
}) => {
  const { selected } = useCurrentDir();
  const { clipboardEntries, dragging } = useGlobalStates();

  const isSelected = useMemo(
    () => selected.get().some(e => e.path === path),
    [selected, name]
  );

  const isCutting = useMemo(() => {
    if (clipboardEntries.get() === null) {
      return false;
    }

    const [entries, cutting] = clipboardEntries.get();
    return cutting && entries.some(e => e.path === path);
  }, [clipboardEntries.get(), path]);

  return (
    <div
      className={cn(
        "w-full h-6",
        "grid items-center gap-6",
        "px-2",
        "text-sm",
        "cursor-default",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]",
        isCutting && "opacity-60",
        "grid-cols-[1.25fr,1fr,1fr,1fr]"
      )}
      onDragStart={event => {
        event.preventDefault();
        let ext = name.split(".").pop().toLowerCase();
        dragging.set(true);
        /* startDrag(
          {
            item: [path],
            icon: ["jpg", "png", "jpeg", "webp", "svg", "gif"].includes(ext)
              ? path
              : "file"
          },
          _ => {
            dragging.set(false);
          }
        ); */
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      draggable
    >
      <EntryName name={name} is_folder={is_folder} />
      <EntryFlagsIcons
        is_hidden={is_hidden}
        is_symlink={is_symlink}
        is_starred={is_starred}
      />
      <EntryDate last_modified={last_modified} />
      {!is_folder && <EntrySize size={size} />}
    </div>
  );
};

export { Entry };
