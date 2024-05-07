import { useCurrentDir } from "@contexts/current-dir";

const TopbarDirDisplay = () => {
  const { dir } = useCurrentDir();

  return <span id="topbar-dir-display" data-tauri-drag-region>{dir()}</span>;
};

export { TopbarDirDisplay };
