import { useDirectory } from "@hooks/use-directory";
import { cn } from "@utils";
import { Entry } from "./entry";

const Viewport = () => {
  const { files } = useDirectory();

  return (
    <div className={cn("w-full h-full", "flex flex-col", "overflow-auto")}>
      {files.map(f => (
        <Entry key={f.name} {...f} />
      ))}
    </div>
  );
};

export { Viewport };
