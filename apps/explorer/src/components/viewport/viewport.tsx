import { useDirectory } from "@hooks/use-directory";
import { cn } from "@utils";
import { Entry } from "./entry";
import { ScrollArea } from "@tredici";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { EntryContextMenu } from "./entry-context-menu";
import { EntryContextProvider } from "@components/providers/entry";

const Viewport = () => {
  const { entries } = useDirectory();

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full", "flex flex-col")}>
        {entries.get().map(f => (
          <EntryContextProvider key={f.name}>
            <EntryContextMenu>
              <Entry {...f} />
            </EntryContextMenu>
          </EntryContextProvider>
        ))}
        <ScrollArea.Scrollbar colorScheme="gray" />
      </ScrollArea>
    </EmptySpaceContextMenu>
  );
};

export { Viewport };
