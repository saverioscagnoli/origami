import React from "react";
import { FolderIcon } from "~/components/icons";
import { Checkbox } from "~/components/tredici";
import { getIconFromExtension } from "~/lib/file-icon-map";
import { cn } from "~/lib/utils";
import { useConfig } from "~/stores/config";

type EntryDisplayProps = {
  name: string;
  isDir: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const EntryDisplay: React.FC<EntryDisplayProps> = ({
  name,
  isDir,
  checked,
  onCheckedChange
}) => {
  const showCheckboxes = useConfig(s => s.showCheckboxes);

  return (
    <span className={cn("flex items-center gap-2")}>
      {showCheckboxes && (
        <Checkbox
          size="sm"
          className={cn(
            "w-3.5 h-3.5",
            "!rounded",
            "border-[1px]",
            "z-50",
            checked ? "visible" : "invisible",
            "group-hover:visible"
          )}
          checked={checked}
          onCheckedChange={onCheckedChange}
          onClick={e => e.stopPropagation()}
        />
      )}
      {isDir ? <FolderIcon /> : getIconFromExtension(name.split(".").pop())}
      <p className={cn("w-32 md:w-40 lg:w-52 xl:w-64", "truncate")}>{name}</p>
    </span>
  );
};

export { EntryDisplay };
