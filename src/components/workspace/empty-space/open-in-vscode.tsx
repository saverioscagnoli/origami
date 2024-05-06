import { VscodeIcon } from "@components/icons/vscode";
import { ContextMenu } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";

const OpenInVsCodeMenuItem = () => {
  const { dir } = useCurrentDir();
  const { openInVscode } = useCommands();

  const onSelect = () => {
    openInVscode(dir);
  };

  return (
    <ContextMenu.Item leftIcon={<VscodeIcon />} onSelect={onSelect}>
      Open In Vscode
    </ContextMenu.Item>
  );
};

export { OpenInVsCodeMenuItem };
