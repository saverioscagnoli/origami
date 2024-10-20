import {
  DesktopIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { FetchKnownFolders } from "@wails/methods/fs/Filesystem";
import { useEffect } from "react";
import { For } from "~/components/for";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { KnownFolder } from "./known-folder";

const KnownFolderGroup = () => {
  const cd = useCurrentDir(s => s.cd);
  const [knownFolders, setKnownFolders] = useEnv(s => [
    s.knownFolders,
    s.setKnownFolders
  ]);

  /**
   * On start:
   * - Fetch the knownFolders from the backend.
   */
  useEffect(() => {
    FetchKnownFolders().then(d =>
      setKnownFolders([
        { name: "Starred", path: d["starred"], icon: <StarFilledIcon /> },
        { name: "Home", path: d["home"], icon: <HomeIcon /> },
        { name: "Desktop", path: d["desktop"], icon: <DesktopIcon /> },
        { name: "Downloads", path: d["downloads"], icon: <DownloadIcon /> },
        { name: "Documents", path: d["documents"], icon: <ReaderIcon /> },
        { name: "Pictures", path: d["pictures"], icon: <ImageIcon /> }
      ])
    );
  }, []);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={knownFolders}>
        {d => {
          //console.log(d);
          return <KnownFolder key={d.path} {...d} onClick={() => cd(d.path)} />;
        }}
      </For>
    </div>
  );
};

export { KnownFolderGroup };
