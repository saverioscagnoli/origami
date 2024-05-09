import { Menubar } from "@components/tredici";

const ViewTypeMenuItems = () => {
  return (
    <Menubar.RadioGroup>
      <Menubar.RadioItem value="list">List View</Menubar.RadioItem>
      <Menubar.RadioItem value="grid">Grid View</Menubar.RadioItem>
    </Menubar.RadioGroup>
  );
};

export { ViewTypeMenuItems };
