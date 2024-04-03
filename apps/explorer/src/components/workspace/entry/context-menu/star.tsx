import { useCurrentDir } from "@hooks/use-current-dir";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api";
import { ContextMenu } from "@tredici";

const Star = () => {
  const { selected } = useCurrentDir();

  const onStar = async () => {
    for (let entry of selected.get()) {
      await invoke("star_entry", { path: entry.path, isFolder: entry.is_folder });
    }
  };

  return (
    <ContextMenu.Item leftIcon={<StarFilledIcon />} onClick={onStar}>
      Star
    </ContextMenu.Item>
  );
};

export { Star };
