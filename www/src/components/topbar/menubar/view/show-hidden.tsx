import React from "react";
import { Menubar } from "~/components/tredici";
import { useConfig } from "~/stores/config";

const ShowHiddenItem: React.FC = () => {
  const [showHidden, setConfig] = useConfig(s => [s.showHidden, s.set]);

  const onCheckedChange = (value: boolean) => {
    setConfig({ showHidden: value });
  };

  return (
    <Menubar.CheckboxItem
      checked={showHidden}
      onCheckedChange={onCheckedChange}
    >
      ShowHidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenItem };
