import { useDirectory } from "@hooks/use-directory";
import { cn } from "@utils";
import { Entry } from "./entry";
import { ScrollArea } from "@tredici";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { EntryContextMenu } from "./entry-context-menu";

const Viewport = () => {
  const { entries } = useDirectory();

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full", "flex flex-col")}>
        {entries.get().map(f => (
          <EntryContextMenu key={f.name}>
            <Entry {...f} />
          </EntryContextMenu>
        ))}
        <ScrollArea.Scrollbar colorScheme="gray" />
      </ScrollArea>
    </EmptySpaceContextMenu>
  );
};

export { Viewport };
