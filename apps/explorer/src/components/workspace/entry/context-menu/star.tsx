import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api";
import { ContextMenu } from "@tredici";

const Star = () => {
  const { selected } = useCurrentDir();
  const { reload } = useNavigation();

  const isStarred = selected.get().every(entry => entry.is_starred);

  const onClick = async () => {
    for (let entry of selected.get()) {
      if (entry.is_starred) {
        await invoke("unstar_entry", { name: entry.name });
      } else {
        await invoke("star_entry", { path: entry.path });
      }
    }

    await reload();
  };

  return (
    <ContextMenu.Item
      leftIcon={isStarred ? <StarIcon /> : <StarFilledIcon />}
      onClick={onClick}
    >
      {isStarred ? "Unstar" : "Star"}
    </ContextMenu.Item>
  );
};

export { Star };
