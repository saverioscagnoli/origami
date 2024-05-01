import { Menubar } from "@components/tredici";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { Settings } from "@typings/settings";

const ViewTypeMenuItems = () => {
  const { viewType } = useSettings();
  const { updateSettings } = useDispatchers();

  const onValueChange = (value: string) => {
    updateSettings({ viewType: value as Settings["viewType"] });
  };

  return (
    <Menubar.RadioGroup value={viewType} onValueChange={onValueChange}>
      <Menubar.RadioItem value="list">List View</Menubar.RadioItem>
      <Menubar.RadioItem value="grid">Grid View</Menubar.RadioItem>
    </Menubar.RadioGroup>
  );
};

export { ViewTypeMenuItems };
