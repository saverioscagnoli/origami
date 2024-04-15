import { ContextMenu } from "@components/tredici";
import { VscodeIcon } from "@components/vscode-icon";
import { useCurrentDir } from "@hooks/use-current-dir";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/command";

const OpenInVscodeMenuItem = () => {
  const { dir } = useCurrentDir();

  const onOpen = () => {
    invoke(Command.OpenInVscode, { path: dir() });
  };

  return (
    <ContextMenu.Item leftIcon={<VscodeIcon />} onClick={onOpen}>
      Open in VS Code
    </ContextMenu.Item>
  );
};

export { OpenInVscodeMenuItem };
