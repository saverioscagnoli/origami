import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { View } from "@typings/settings";

const ViewTypeMenuItems = () => {
  const { view, updateSettings } = useSettings();

  const onValueChange = (value: string) => {
    updateSettings({ view: value as View });
  };

  return (
    <Menubar.RadioGroup value={view} onValueChange={onValueChange}>
      <Menubar.RadioItem value="list">List View</Menubar.RadioItem>
      <Menubar.RadioItem value="grid">Grid View</Menubar.RadioItem>
    </Menubar.RadioGroup>
  );
};

export { ViewTypeMenuItems };
