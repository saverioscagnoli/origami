import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { CheckboxIcon } from "@radix-ui/react-icons";

const ShowCheckboxesMenuItem = () => {
  const { showCheckboxes, updateSettings } = useSettings();

  const onCheckedChange = (value: boolean) => {
    updateSettings({ showCheckboxes: value });
  };

  return (
    <Menubar.CheckboxItem
      leftIcon={<CheckboxIcon />}
      checked={showCheckboxes}
      onCheckedChange={onCheckedChange}
    >
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesMenuItem };
