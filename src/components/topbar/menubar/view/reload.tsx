import { Menubar } from "@components/tredici";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ReloadMenuItem = () => {
  const push = useCallstack(state => state.push);
  const dir = useCurrentDir(state => state.dir);

  const onSelect = () => {
    push(CommandName.ListDir, { dir });
  };

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} onSelect={onSelect}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
