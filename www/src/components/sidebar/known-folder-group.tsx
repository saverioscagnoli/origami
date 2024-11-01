import React from "react";
import { For } from "~/components/for";
import { cn } from "~/lib/utils";
import { useEnv } from "~/stores/env";
import { KnownFolder } from "./known-folder";

const KnownFolderGroup: React.FC = () => {
  const knownFolders = useEnv(s => s.knownFolders);

  return (
    <>
      <p className={cn("pl-3 pt-2", "text-sm")}>Quick access</p>
      <div className={cn("w-full", "flex flex-col", "pt-2")}>
        <For of={knownFolders}>{f => <KnownFolder {...f} />}</For>
      </div>
    </>
  );
};

export { KnownFolderGroup };
