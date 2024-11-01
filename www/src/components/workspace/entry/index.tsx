import { fs } from "@wails/go/models";
import { memo, MouseEventHandler, useMemo } from "react";
import { cn } from "~/lib/utils";
import { useDir } from "~/stores/dir";
import { EntryDisplay } from "./display";
import { EntryFlags } from "./flags";
import { EntrySize } from "./size";
import { EntryLastMod } from "./last-mod";

const Entry = memo<fs.DirEntry>(entry => {
  const [cd, selected, setDir] = useDir(s => [s.cd, s.selected, s.set]);

  const isSelected = useMemo(
    () => selected.some(s => s.path === entry.path),
    [selected]
  );

  const onClick: MouseEventHandler = e => {
    if (e.detail === 1) {
      if (e.ctrlKey) {
        if (isSelected) {
          setDir({ selected: selected.filter(s => s.path !== entry.path) });
        } else {
          setDir({ selected: [...selected, entry] });
        }
      } else if (e.shiftKey) {
      } else {
        setDir({ selected: [entry] });
      }
    } else if (e.detail === 2) {
      if (entry.isDir) {
        cd(entry.path);
      }
    }
  };

  const onCheckedChange = (checked: boolean) => {
    if (isSelected) {
      setDir({ selected: selected.filter(s => s.path !== entry.path) });
    } else {
      setDir({ selected: [...selected, entry] });
    }
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        "hover:bg-[--gray-3]",
        {
          "hover:bg-[--gray-3]": !isSelected,
          "bg-[--gray-4]": isSelected
        },
        "group"
      )}
      onClick={onClick}
    >
      <EntryDisplay
        {...entry}
        checked={isSelected}
        onCheckedChange={onCheckedChange}
      />
      <EntryFlags {...entry} />
      <EntryLastMod {...entry} />
      <EntrySize {...entry} />
    </div>
  );
});

export { Entry };
