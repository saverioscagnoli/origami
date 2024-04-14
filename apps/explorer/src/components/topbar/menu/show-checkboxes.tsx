import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { CheckboxIcon } from "@radix-ui/react-icons";

const ShowCheckboxesItem = () => {
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

export { ShowCheckboxesItem };
