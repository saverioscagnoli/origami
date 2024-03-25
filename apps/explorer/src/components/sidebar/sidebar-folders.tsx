import { useDirectory } from "@hooks/use-directory";
import {
  DesktopIcon,
  DownloadIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import {
  desktopDir,
  documentDir,
  downloadDir,
  pictureDir
} from "@tauri-apps/api/path";
import { cn } from "@utils";
import React, { ReactNode, useEffect, useState } from "react";

type SidebarFolderProps = {
  icon: ReactNode;
  path: string;
  label: string;
};

const SidebarFolder: React.FC<SidebarFolderProps> = ({ icon, path, label }) => {
  const { dir, changeDir } = useDirectory();
  const open = dir.get() === path;

  const onClick = () => changeDir(path);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "px-4 py-0.5",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        open && "bg-[--gray-3]"
      )}
      onClick={onClick}
    >
      {icon}
      <p>{label}</p>
    </div>
  );
};

const SidebarFolders = () => {
  const [desktop, setDesktop] = useState<string>("");
  const [downloads, setDownloads] = useState<string>("");
  const [documents, setDocuments] = useState<string>("");
  const [pictures, setPictures] = useState<string>("");

  useEffect(() => {
    desktopDir().then(setDesktop);
    downloadDir().then(setDownloads);
    documentDir().then(setDocuments);
    pictureDir().then(setPictures);
  }, []);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <SidebarFolder icon={<StarFilledIcon />} path={desktop} label="Starred" />
      <SidebarFolder icon={<DesktopIcon />} path={desktop} label="Desktop" />
      <SidebarFolder
        icon={<DownloadIcon />}
        path={downloads}
        label="Downloads"
      />
      <SidebarFolder icon={<ReaderIcon />} path={documents} label="Documents" />
      <SidebarFolder icon={<ImageIcon />} path={pictures} label="Pictures" />
    </div>
  );
};

export { SidebarFolders };
