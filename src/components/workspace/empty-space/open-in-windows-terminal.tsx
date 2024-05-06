import { WindowsTerminalIcon } from "@components/icons/wt";
import { ContextMenu } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";

const OpenInWindowsTerminalMenuItem = () => {
  const { dir } = useCurrentDir();
  const { openInWindowsTerminal } = useCommands();

  const onSelect = () => {
    openInWindowsTerminal(dir);
  };

  return (
    <ContextMenu.Item leftIcon={<WindowsTerminalIcon />} onSelect={onSelect}>
      Open in Terminal
    </ContextMenu.Item>
  );
};

export { OpenInWindowsTerminalMenuItem };
