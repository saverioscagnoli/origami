import { Menubar } from "@components/tredici";
import { CheckboxIcon } from "@radix-ui/react-icons";

const ShowCheckboxesMenuItem = () => {
  return (
    <Menubar.CheckboxItem leftIcon={<CheckboxIcon />}>
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesMenuItem };
