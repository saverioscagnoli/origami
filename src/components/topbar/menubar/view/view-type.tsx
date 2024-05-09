import { Menubar } from "@components/tredici";
import { View, useSettings } from "@zustand/settings-store";

const ViewTypeMenuItems = () => {
  const [view, updateSettings] = useSettings(state => [
    state.view,
    state.updateSettings
  ]);

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
