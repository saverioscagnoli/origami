import { Spinner } from "@components/tredici";
import { cn } from "@lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BasicDirLabel } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "./search-input";

const TopbarDirDisplay = () => {
  const [dir, changing] = useCurrentDir(state => [state.dir, state.changing]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const basicDirs = useEnvironment(state => state.basicDirs);
  const searching = useGlobalStates(state => state.searching);

  const starredDir = useMemo(
    () => basicDirs.find(b => b.label === BasicDirLabel.Starred),
    [basicDirs]
  );

  useEffect(() => {
    let timer: number;

    if (changing) {
      timer = setTimeout(() => {
        setShowSpinner(true);
      }, 100);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [changing]);

  return (
    <span
      data-tauri-drag-region
      id="topbar-dir-display"
      className={cn(
        "w-full h-full",
        "text-sm",
        "grid place-items-center",
        "cursor-default",
        "active:data-[tauri-drag-region]:cursor-grabbing"
      )}
    >
      {searching.state ? (
        <SearchInput />
      ) : showSpinner ? (
        <Spinner />
      ) : dir.includes(starredDir?.path) ? (
        <span className={cn("flex items-center")}>
          <StarFilledIcon className={cn("w-4 h-4")} />
          {dir.slice(starredDir!.path.length)}
        </span>
      ) : (
        dir
      )}
    </span>
  );
};

export { TopbarDirDisplay };
