import { StarFilledIcon } from "@radix-ui/react-icons";
import React, { useMemo, useState } from "react";
import { Spinner } from "~/components/tredici";
import useDebounce from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { useStates } from "~/zustand/states";
import { SearchInput } from "./search-input";

const DirDisplay: React.FC = () => {
  const [dir, changing] = useCurrentDir(s => [s.dir, s.changing]);
  const [sep, knownFolders] = useEnv(s => [s.sep, s.knownFolders]);
  const [showSpinner, setShowSpinner] = useState(false);

  const searching = useStates(s => s.searching);

  const starredDir = useMemo(
    () => knownFolders.find(k => k.name == "Starred")?.path,
    [dir]
  );

  useDebounce(
    () => {
      setShowSpinner(changing);
    },
    50,
    [changing]
  );

  return (
    <span
      style={{ widows: 1 }}
      className={cn(
        "w-full h-full",
        "text-sm",
        "grid place-items-center",
        "truncate"
      )}
    >
      {searching.state ? (
        <SearchInput />
      ) : showSpinner ? (
        <Spinner />
      ) : starredDir && dir.endsWith(":") ? (
        dir + sep
      ) : dir.includes(starredDir!) ? (
        <span className={cn("flex items-center")}>
          <StarFilledIcon className={cn("w-4 h-4")} />
          {dir.slice(starredDir!.length)}
        </span>
      ) : (
        dir
      )}
    </span>
  );
};

export { DirDisplay };
