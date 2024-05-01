import { Menubar } from "@components/tredici";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { CheckboxIcon } from "@radix-ui/react-icons";

const ShowCheckboxesMenuItem = () => {
  const { showCheckboxes } = useSettings();
  const { updateSettings } = useDispatchers();

  const onCheckedChange = (checked: boolean) => {
    updateSettings({ showCheckboxes: checked });
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
