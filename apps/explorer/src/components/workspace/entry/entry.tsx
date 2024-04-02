import { Entry as EntryT } from "@types";
import { cn } from "@utils";
import React, { CSSProperties, useMemo } from "react";
import { EntryName } from "./entry-name";
import { EntryFlagsIcons } from "./entry-flags-icons";
import { EntryDate } from "./entry-date";
import { EntrySize } from "./entry-size";
import { useCurrentDir } from "@hooks/use-current-dir";

type EntryProps = EntryT & {
  style: CSSProperties;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDoubleClick: () => void;
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
  style,
  onClick,
  onDoubleClick
}) => {
  const { selected } = useCurrentDir();
  const isSelected = useMemo(
    () => selected.get().some(e => e.path === path),
    [selected, name]
  );

  return (
    <div
      className={cn(
        "w-[90%] h-6",
        "flex items-center gap-4",
        "px-4",
        "text-sm",
        "cursor-default",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]"
      )}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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
