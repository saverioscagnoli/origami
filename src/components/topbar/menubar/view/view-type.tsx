import { Menubar } from "@components/tredici";
import { useSettings } from "@contexts/settings";

const ViewTypeMenuItems = () => {
  const { viewType } = useSettings();

  return (
    // @ts-ignore
    <Menubar.RadioGroup value={viewType()} onValueChange={viewType.set}>
      <Menubar.RadioItem value="list">List View</Menubar.RadioItem>
      <Menubar.RadioItem value="grid">Grid View</Menubar.RadioItem>
    </Menubar.RadioGroup>
  );
};

export { ViewTypeMenuItems };
