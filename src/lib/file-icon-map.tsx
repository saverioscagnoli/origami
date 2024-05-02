import {
  ArchiveIcon,
  CubeIcon,
  DiscIcon,
  FileTextIcon,
  ImageIcon
} from "@radix-ui/react-icons";

const fileIconMap = new Map([
  ["png", <ImageIcon className="w-full h-full" />],
  ["jpg", <ImageIcon className="w-full h-full" />],
  ["jpeg", <ImageIcon className="w-full h-full" />],
  ["gif", <ImageIcon className="w-full h-full" />],
  ["webp", <ImageIcon className="w-full h-full" />],
  ["txt", <FileTextIcon className="w-full h-full" />],
  ["doc", <FileTextIcon className="w-full h-full" />],
  ["iso", <DiscIcon className="w-full h-full" />],
  ["zip", <ArchiveIcon className="w-full h-full" />],
  ["tar", <ArchiveIcon className="w-full h-full" />],
  ["rar", <ArchiveIcon className="w-full h-full" />],
  ["7zip", <ArchiveIcon className="w-full h-full" />],
  ["gz", <ArchiveIcon className="w-full h-full" />],
  ["exe", <CubeIcon className="w-full h-full" />],
  ["appimage", <CubeIcon className="w-full h-full" />]
]);

export { fileIconMap };
