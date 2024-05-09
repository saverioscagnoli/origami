import { Menubar } from "@components/tredici";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useSettings } from "@zustand/settings-store";

const ShowHiddenMenuItem = () => {
  const [showHidden, updateSettings] = useSettings(state => [
    state.showHidden,
    state.updateSettings
  ]);

  const onCheckedChange = (checked: boolean) => {
    updateSettings({ showHidden: checked });
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
