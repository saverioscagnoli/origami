import React from "react";
import { Menubar } from "~/components/tredici";
import { useConfig, ViewType } from "~/stores/config";

const ViewTypeItem: React.FC = () => {
  const [view, setConfig] = useConfig(s => [s.view, s.set]);

  const onValueChange = (value: string) => {
    setConfig({ view: value as ViewType });
  };

  return (
    <>
      <Menubar.Label>View</Menubar.Label>
      <Menubar.RadioGroup value={view} onValueChange={onValueChange}>
        <Menubar.RadioItem value="list">List</Menubar.RadioItem>
        <Menubar.RadioItem value="grid">Grid</Menubar.RadioItem>
      </Menubar.RadioGroup>
    </>
  );
};

export { ViewTypeItem };
