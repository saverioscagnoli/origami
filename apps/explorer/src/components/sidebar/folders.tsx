import { For } from "@components/for";
import { useAccessor } from "@hooks/use-accessor";
import { onMount } from "@life-cycle";
import {
  appConfigDir,
  desktopDir,
  documentDir,
  downloadDir,
  homeDir,
  pictureDir
} from "@tauri-apps/api/path";
import { cn } from "@utils";
import { SidebarFolder } from "./folder";
import { sep } from "@tauri-apps/api/path";
import { ReactNode } from "react";
import {
  DesktopIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { useNavigation } from "@hooks/use-navigation";

type FolderData = {
  path: string;
  icon: ReactNode;
};

const SidebarFolders = () => {
  const { changeDir } = useNavigation();
  const paths = useAccessor<FolderData[]>([]);

  onMount(async () => {
    paths.set([
      {
        path: (await appConfigDir()) + "starred" + sep,
        icon: <StarFilledIcon />
      },
      {
        path: await homeDir(),
        icon: <HomeIcon />
      },
      {
        path: await desktopDir(),
        icon: <DesktopIcon />
      },
      {
        path: await downloadDir(),
        icon: <DownloadIcon />
      },
      {
        path: await documentDir(),
        icon: <ReaderIcon />
      },
      {
        path: await pictureDir(),
        icon: <ImageIcon />
      }
    ]);
  });

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={paths.get()}>
        {(d, i) => (
          <SidebarFolder
            key={i}
            icon={d.icon}
            label={d.path.split(sep).at(-2)}
            path={d.path}
            onClick={changeDir(d.path)}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolders };
