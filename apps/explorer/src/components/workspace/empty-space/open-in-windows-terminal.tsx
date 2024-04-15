import { WindowsTerminalIcon } from "@components/icons";
import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/command";

const OpenInWindowsTerminalMenuItem = () => {
  const { dir } = useCurrentDir();

  const onOpen = () => {
    invoke(Command.OpenInWindowsTerminal, { path: dir() });
  };

  return (
    <ContextMenu.Item leftIcon={<WindowsTerminalIcon />} onClick={onOpen}>
      Open in Terminal
    </ContextMenu.Item>
  );
};

export { OpenInWindowsTerminalMenuItem };
