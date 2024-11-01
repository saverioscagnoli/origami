import {
  ArchiveIcon,
  CubeIcon,
  DiscIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  ImageIcon,
  VideoIcon
} from "@radix-ui/react-icons";

const fileIconMap = new Map([
  /**
   * TEXT FILES
   */
  ["txt", <FileTextIcon />],
  ["md", <FileTextIcon />],
  ["pdf", <FileTextIcon />],

  /**
   * CODE FILES
   */
  ["sys", <GearIcon />],
  ["conf", <GearIcon />],
  ["json", <GearIcon />],
  ["yml", <GearIcon />],
  ["yaml", <GearIcon />],
  ["toml", <GearIcon />],
  ["ini", <GearIcon />],

  /**
   * EXECUTABLE FILES
   */
  ["exe", <CubeIcon />],
  ["deb", <CubeIcon />],
  ["rpm", <CubeIcon />],
  ["dmg", <CubeIcon />],
  ["pkg", <CubeIcon />],
  ["msi", <CubeIcon />],

  /**
   * ARCHIVE FILES
   */
  ["zip", <ArchiveIcon />],
  ["tar", <ArchiveIcon />],
  ["gz", <ArchiveIcon />],
  ["bz2", <ArchiveIcon />],
  ["xz", <ArchiveIcon />],
  ["7z", <ArchiveIcon />],
  ["rar", <ArchiveIcon />],

  /**
   * IMAGE FILES
   */
  ["png", <ImageIcon />],
  ["jpg", <ImageIcon />],
  ["jpeg", <ImageIcon />],
  ["gif", <ImageIcon />],
  ["bmp", <ImageIcon />],
  ["svg", <ImageIcon />],
  ["webp", <ImageIcon />],
  ["ico", <ImageIcon />],
  ["tiff", <ImageIcon />],
  ["jfif", <ImageIcon />],

  /**
   * VIDEO FILES
   */
  ["mp4", <VideoIcon />],
  ["mkv", <VideoIcon />],
  ["webm", <VideoIcon />],
  ["avi", <VideoIcon />],
  ["mov", <VideoIcon />],
  ["wmv", <VideoIcon />],
  ["flv", <VideoIcon />],
  ["3gp", <VideoIcon />],
  ["mpg", <VideoIcon />],
  ["mpeg", <VideoIcon />],
  ["m4v", <VideoIcon />],

  ["iso", <DiscIcon />]
]);

function getIconFromExtension(extension?: string): JSX.Element {
  if (!extension) return <FileIcon />;
  return fileIconMap.get(extension) || <FileIcon />;
}

export { getIconFromExtension };
