import { StarFilledIcon } from "@radix-ui/react-icons";
import React, { useMemo } from "react";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";

const DirDisplay: React.FC = () => {
  const dir = useCurrentDir(s => s.dir);
  const [sep, knownFolders] = useEnv(s => [s.sep, s.knownFolders]);

  const starredDir = useMemo(
    () => knownFolders.find(k => k.name == "Starred")?.path,
    [dir]
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
      {starredDir && dir.endsWith(":") ? (
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
