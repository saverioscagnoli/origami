import { Menubar } from "@components/tredici";
import { useSettings } from "@contexts/settings";
import { CheckboxIcon } from "@radix-ui/react-icons";

const ShowCheckboxesMenuItem = () => {
  const { showCheckboxes } = useSettings();

  return (
    <Menubar.CheckboxItem
      leftIcon={<CheckboxIcon />}
      checked={showCheckboxes()}
      onCheckedChange={showCheckboxes.set}
    >
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesMenuItem };
