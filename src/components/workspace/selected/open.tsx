import { ContextMenu } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { EnterIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

const OpenMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);

  const onSelect = () => {
    const paths = selected.map(e => e.path);
    if (paths.length === 1 && selected.at(0)!.isDir) {
      invoke(CommandName.ListDir, { dir: paths.at(0)! });
    } else {
      invoke(CommandName.OpenFiles, { paths });
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onSelect={onSelect}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
