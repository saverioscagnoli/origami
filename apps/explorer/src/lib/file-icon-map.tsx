import { ReactNode } from "react";
import {
  ArchiveIcon,
  ArrowDownIcon,
  CrumpledPaperIcon,
  CubeIcon,
  DiscIcon,
  FileTextIcon,
  ImageIcon,
  LockClosedIcon,
  PilcrowIcon,
  ReaderIcon,
  SpeakerLoudIcon,
  VideoIcon
} from "@radix-ui/react-icons";

const fileIconMap = new Map<string, ReactNode>([
  ["txt", <FileTextIcon />],
  ["doc", <ReaderIcon />],
  ["docx", <ReaderIcon />],
  ["pdf", <ReaderIcon />],
  ["zip", <ArchiveIcon />],
  ["tar", <ArchiveIcon />],
  ["gz", <ArchiveIcon />],
  ["xz", <ArchiveIcon />],
  ["bz2", <ArchiveIcon />],
  ["7z", <ArchiveIcon />],
  ["rar", <ArchiveIcon />],
  ["png", <ImageIcon />],
  ["jpg", <ImageIcon />],
  ["jpeg", <ImageIcon />],
  ["gif", <ImageIcon />],
  ["webp", <ImageIcon />],
  ["bmp", <ImageIcon />],
  ["tiff", <ImageIcon />],
  ["svg", <ImageIcon />],
  ["ico", <ImageIcon />],
  ["jfif", <ImageIcon />],
  ["ttf", <PilcrowIcon />],
  ["otf", <PilcrowIcon />],
  ["woff", <PilcrowIcon />],
  ["woff2", <PilcrowIcon />],
  ["eot", <PilcrowIcon />],
  ["md", <ArrowDownIcon />],
  ["key", <LockClosedIcon />],
  ["ppk", <LockClosedIcon />],
  ["exe", <CubeIcon />],
  ["msi", <CubeIcon />],
  ["bat", <CubeIcon />],
  ["appimage", <CubeIcon />],
  ["tmp", <CrumpledPaperIcon />],
  ["mp3", <SpeakerLoudIcon />],
  ["wav", <SpeakerLoudIcon />],
  ["flac", <SpeakerLoudIcon />],
  ["ogg", <SpeakerLoudIcon />],
  ["mp4", <VideoIcon />],
  ["mkv", <VideoIcon />],
  ["avi", <VideoIcon />],
  ["mov", <VideoIcon />],
  ["flv", <VideoIcon />],
  ["wmv", <VideoIcon />],
  ["webm", <VideoIcon />],
  ["iso", <DiscIcon />],
  ["img", <DiscIcon />]
]);

export { fileIconMap };