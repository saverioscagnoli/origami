import { Menubar } from "@components/tredici";
import { CheckboxIcon } from "@radix-ui/react-icons";
import { useSettings } from "@zustand/settings-store";

const ShowCheckboxesMenuItem = () => {
  const [showCheckboxes, updateSettings] = useSettings(state => [
    state.showCheckboxes,
    state.updateSettings
  ]);

  const onCheckedChange = (checked: boolean) => {
    updateSettings({ showCheckboxes: checked });
  };

  return (
    <Menubar.CheckboxItem
      shortcut="Ctrl + J"
      checked={showCheckboxes}
      onCheckedChange={onCheckedChange}
    >
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesMenuItem };
