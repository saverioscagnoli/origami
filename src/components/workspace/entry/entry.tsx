import { cn } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { FC, MouseEventHandler } from "react";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { EntryName } from "./name";
import { EntrySize } from "./size";

type EntryProps = DirEntry & {
  height: number;
  transform: number;
};

const Entry: FC<EntryProps> = ({ height, transform, ...entry }) => {
  const { name, path, isDir, isHidden, isSymlink, isStarred, lastModified, size } =
    entry;

  const [push] = useCallstack(state => [state.push]);

  const onClick: MouseEventHandler = e => {
    if (e.detail === 1) {
    } else if (e.detail === 2) {
      if (isDir) {
        push(CommandName.ListDir, { dir: path });
      }
    }
  };

  return (
    <div
      className={cn(
        "w-full",
        "absolute top-0 left-0",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        "hover:bg-[--gray-3]",
        "group"
      )}
      style={{ height, transform: `translateY(${transform}px)` }}
      onClick={onClick}
    >
      <span className={cn("flex items-center justify-start text-start gap-1.5")}>
        <EntryName {...{ name, path, isDir }} />
      </span>
      <EntryFlags {...{ isHidden, isSymlink, isStarred }} />
      <EntryLastModified lastModified={lastModified} />
      <EntrySize {...{ isDir, size }} />
    </div>
  );
};

export { Entry };
