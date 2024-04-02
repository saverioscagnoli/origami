import { useFlags } from "@hooks/use-flags";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const ShowHidden = () => {
  const { showHidden } = useFlags();

  return (
    <Menubar.CheckboxItem
      checked={showHidden.get()}
      onCheckedChange={showHidden.set}
      leftIcon={showHidden.get() ? <EyeOpenIcon /> : <EyeClosedIcon />}
    >
      Show Hidden Items
    </Menubar.CheckboxItem>
  );
};

export { ShowHidden };
