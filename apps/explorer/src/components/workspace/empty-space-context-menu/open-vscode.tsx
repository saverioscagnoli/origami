import { useCurrentDir } from "@hooks/use-current-dir";
import { invoke } from "@tauri-apps/api";
import { ContextMenu } from "@tredici";
import { TbBrandVscode } from "react-icons/tb";

const OpenVscode = () => {
  const { dir } = useCurrentDir();

  const onOpenVscode = async () => {
    await invoke("open_vscode", { path: dir.get() });
  };

  return (
    <ContextMenu.Item leftIcon={<TbBrandVscode />} onClick={onOpenVscode}>
      Open in VS Code
    </ContextMenu.Item>
  );
};

export { OpenVscode };
