import { ReactNode } from "react";

import {
  ArchiveIcon,
  CodeIcon,
  CrumpledPaperIcon,
  CubeIcon,
  DiscIcon,
  FileTextIcon,
  GearIcon,
  GlobeIcon,
  ImageIcon,
  MixerVerticalIcon
} from "@radix-ui/react-icons";

import { LuMusic, LuKey, LuLibrary, LuTerminal } from "react-icons/lu";
import { FaGitAlt, FaMarkdown } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";

const fileIconMap = new Map<string, ReactNode>([
  ["txt", <FileTextIcon />],
  ["log", <FileTextIcon />],
  ["jpg", <ImageIcon />],
  ["jpeg", <ImageIcon />],
  ["png", <ImageIcon />],
  ["gif", <ImageIcon />],
  ["webp", <ImageIcon />],
  ["svg", <ImageIcon />],
  ["ico", <ImageIcon />],
  ["zip", <ArchiveIcon />],
  ["rar", <ArchiveIcon />],
  ["7z", <ArchiveIcon />],
  ["tar", <ArchiveIcon />],
  ["gz", <ArchiveIcon />],
  ["mp3", <LuMusic />],
  ["wav", <LuMusic />],
  ["ogg", <LuMusic />],
  ["exe", <CubeIcon />],
  ["bin", <CubeIcon />],
  ["msi", <CubeIcon />],
  ["iso", <DiscIcon />],
  ["appimage", <CubeIcon />],
  ["key", <LuKey />],
  ["ppk", <LuKey />],
  ["env", <GlobeIcon />],
  ["dll", <LuLibrary />],
  ["xml", <CodeIcon />],
  ["html", <CodeIcon />],
  ["ini", <MixerVerticalIcon />],
  ["config", <MixerVerticalIcon />],
  ["sys", <GearIcon />],
  ["tmp", <CrumpledPaperIcon />],
  ["temp", <CrumpledPaperIcon />],
  ["gitconfig", <FaGitAlt />],
  ["gitignore", <FaGitAlt />],
  ["gitattributes", <FaGitAlt />],
  ["gitmodules", <FaGitAlt />],
  ["gitkeep", <FaGitAlt />],
  ["git", <FaGitAlt />],
  ["json", <CodeIcon />],
  ["md", <FaMarkdown />],
  ["bashrc", <CodeIcon />],
  ["sh", <LuTerminal />],
  ["js", <IoLogoJavascript />]
]);

export { fileIconMap };
