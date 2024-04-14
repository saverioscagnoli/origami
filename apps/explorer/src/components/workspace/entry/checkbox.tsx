import { Checkbox } from "@components/tredici";
import { cn } from "@lib/utils";
import { FC } from "react";

type EntryCheckboxProps = {
  checked: boolean;
  addSelected: () => void;
  removeSelected: () => void;
  replaceSelected: () => void;
};

const EntryCheckbox: FC<EntryCheckboxProps> = ({
  checked,
  addSelected,
  removeSelected
}) => {
  const onCheckedChange = (checked: boolean) => {
    checked ? addSelected() : removeSelected();
  };

  return (
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
      checked={!!checked}
      onCheckedChange={onCheckedChange}
      onClick={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
    />
  );
};

export { EntryCheckbox };
