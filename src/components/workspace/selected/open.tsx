import { ContextMenu } from "@components/tredici";
import { EnterIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

const OpenMenuItem = () => {
  const push = useCallstack(state => state.push);
  const selected = useCurrentDir(state => state.selected);

  const onSelect = () => {
    const paths = selected.map(e => e.path);
    if (paths.length === 1 && selected.at(0)!.isDir) {
      push(CommandName.ListDir, { dir: paths.at(0)! });
    } else {
      push(CommandName.OpenFiles, { paths });
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onSelect={onSelect}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
