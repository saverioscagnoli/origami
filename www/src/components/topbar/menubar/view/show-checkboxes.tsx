import React from "react";
import { Menubar } from "~/components/tredici";
import { useConfig } from "~/stores/config";

const ShowCheckboxesItem: React.FC = () => {
  const [showCheckboxes, setConfig] = useConfig(s => [s.showCheckboxes, s.set]);

  const onCheckedChange = (value: boolean) => {
    setConfig({ showCheckboxes: value });
  };

  return (
    <Menubar.CheckboxItem
      checked={showCheckboxes}
      onCheckedChange={onCheckedChange}
    >
      Show Checkboxes
    </Menubar.CheckboxItem>
  );
};

export { ShowCheckboxesItem };
