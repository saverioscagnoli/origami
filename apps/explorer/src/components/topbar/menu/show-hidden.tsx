import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const ShowHiddenMenuItem = () => {
  const { showHidden } = useSettings();

  return (
    <Menubar.CheckboxItem
      leftIcon={showHidden() ? <EyeOpenIcon /> : <EyeClosedIcon />}
      checked={showHidden()}
      onCheckedChange={showHidden.set}
    >
      Show Hidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenMenuItem };
