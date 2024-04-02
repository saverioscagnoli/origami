import { cn } from "@utils";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";

const Workspace = () => {
  const { entries } = useCurrentDir();
  const { changeDir } = useNavigation();

  return (
    <EmptySpaceContextMenu>
      <div className={cn("w-full h-full", "overflow-auto")}>
        {entries.get().map(entry => (
          <div
            key={entry.path}
            className={cn("w-full h-8", "hover:bg-[--gray-3]")}
            onDoubleClick={changeDir(entry.path)}
          >
            {entry.name}
          </div>
        ))}
      </div>
    </EmptySpaceContextMenu>
  );
};

export { Workspace };
