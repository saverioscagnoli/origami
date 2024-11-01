import { StarFilledIcon } from "@radix-ui/react-icons";
import React, { useMemo, useState } from "react";
import useDebounce from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";
import { useDir } from "~/stores/dir";
import { useEnv } from "~/stores/env";
import { Spinner } from "../tredici";

const DirDisplay: React.FC = () => {
  const [dir, isChanging] = useDir(s => [s.dir, s.isChanging]);
  const [knownFolders, sep] = useEnv(s => [s.knownFolders, s.sep]);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const starredDir = useMemo(
    () => knownFolders.find(f => f.name === "Starred")?.path,
    [knownFolders]
  );

  useDebounce(
    () => {
      setShowSpinner(isChanging);
    },
    50,
    [isChanging]
  );

  return (
    <p className={cn("text-sm")}>
      {/* Windows disks are like A:, B: (I dont like that they dont end with the separator :#) */}
      {showSpinner ? (
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
    </p>
  );
};

export { DirDisplay };
