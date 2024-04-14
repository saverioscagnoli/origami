import { cn } from "@lib/utils";
import { FC, MouseEventHandler } from "react";
import { EntryName } from "./name";
import { DirEntry } from "@typings/dir-entry";
import { EntryFlags } from "./flags";
import { EntryCheckbox } from "./checkbox";

type EntryProps = DirEntry & {
  showCheckboxes: boolean;
  isSelected: boolean;
  isRenaming: boolean;
  stopRenaming: () => void;
  addSelected: () => void;
  removeSelected: () => void;
  replaceSelected: () => void;
  onDoubleClick: () => void;
  onContextMenu: () => void;
};

const Entry: FC<EntryProps> = ({
  showCheckboxes,
  isSelected,
  isRenaming,
  stopRenaming,
  addSelected,
  removeSelected,
  replaceSelected,
  onDoubleClick,
  onContextMenu,
  ...e
}) => {
  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.ctrlKey) {
      addSelected();
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
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      draggable
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
          name={e.name}
          isDir={e.isDir}
          isRenaming={isRenaming}
          stopRenaming={stopRenaming}
        />
      </span>
      <EntryFlags
        isHidden={e.isHidden}
        isSymlink={e.isSymlink}
        isStarred={e.isStarred}
      />
    </div>
  );
};

export { Entry };
