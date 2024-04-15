import { cn } from "@lib/utils";
import { FC, MouseEventHandler } from "react";
import { EntryName } from "./name";
import { DirEntry } from "@typings/dir-entry";
import { EntryFlags } from "./flags";
import { EntryCheckbox } from "./checkbox";
import { EntryLastModified } from "./last-modified";
import { EntrySize } from "./size";

type EntryProps = DirEntry & {
  path: string;
  showCheckboxes: boolean;
  isSelected: boolean;
  isCutting: boolean;
  isRenaming: boolean;
  create: (name: string, isDir: boolean) => void;
  stopCreating: () => void;
  rename: (newName: string) => void;
  stopRenaming: () => void;
  addSelected: () => void;
  removeSelected: () => void;
  replaceSelected: () => void;
  selectAllBetween: () => void;
  onDoubleClick: () => void;
  onContextMenu: () => void;
};

const Entry: FC<EntryProps> = ({
  path,
  showCheckboxes,
  isSelected,
  isCutting,
  isRenaming,
  create,
  stopCreating,
  rename,
  stopRenaming,
  addSelected,
  removeSelected,
  replaceSelected,
  selectAllBetween,
  onDoubleClick,
  onContextMenu,
  ...e
}) => {
  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.ctrlKey) {
      addSelected();
    } else if (e.shiftKey) {
      selectAllBetween();
    } else {
      replaceSelected();
    }
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-1",
        "text-sm",
        "group",
        isCutting && "opacity-60",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      draggable
      onDragStart={e=> {
        e.dataTransfer.setData("text/plain", path);
      
      }}
    >
      <span className={cn("flex items-center gap-1")}>
        {showCheckboxes && (
          <EntryCheckbox
            checked={isSelected}
            removeSelected={removeSelected}
            addSelected={addSelected}
            replaceSelected={replaceSelected}
          />
        )}
        <EntryName
          path={path}
          name={e.name}
          isDir={e.isDir}
          isRenaming={isRenaming}
          create={create}
          stopCreating={stopCreating}
          rename={rename}
          stopRenaming={stopRenaming}
        />
      </span>
      <EntryFlags
        isHidden={e.isHidden}
        isSymlink={e.isSymlink}
        isStarred={e.isStarred}
      />
      <EntryLastModified lastModified={e.lastModified} />
      <EntrySize isDir={e.isDir} size={e.size} />
    </div>
  );
};

export { Entry };
