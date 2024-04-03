import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { EnterIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Open = () => {
  const { selected } = useCurrentDir();
  const { open } = useNavigation();

  const onOpen = async () => {
    console.log(selected.get())
    for (let entry of selected.get()) {
      await open(entry)();
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onClick={onOpen} >
      Open
    </ContextMenu.Item>
  );
};

export { Open };
