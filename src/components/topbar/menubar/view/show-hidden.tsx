import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const ShowHiddenMenuItem = () => {
  const { showHidden, updateSettings } = useSettings();

  const onCheckedChange = (value: boolean) => {
    updateSettings({ showHidden: value });
  };

  return (
    <Menubar.CheckboxItem
      leftIcon={showHidden ? <EyeOpenIcon /> : <EyeClosedIcon />}
      checked={showHidden}
      onCheckedChange={onCheckedChange}
    >
      Show Hidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenMenuItem };
