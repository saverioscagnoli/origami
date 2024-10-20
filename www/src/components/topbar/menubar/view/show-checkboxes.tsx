import React from "react";
import { Menubar } from "~/components/tredici";
import { useSettings } from "~/zustand/settings";

const ShowCheckboxesMenuItem: React.FC = () => {
  const [showCheckboxes, setShowCheckboxes] = useSettings(state => [
    state.showCheckboxes,
    state.setShowCheckboxes
  ]);

  return (
    <Menubar.CheckboxItem
      shortcut="Ctrl + J"
      checked={showCheckboxes}
      onCheckedChange={setShowCheckboxes}
    >
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesMenuItem };
