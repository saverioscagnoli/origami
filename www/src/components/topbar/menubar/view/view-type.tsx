import React from "react";
import { Menubar } from "~/components/tredici";
import { useSettings } from "~/zustand/settings";

const ViewTypeMenuItems: React.FC = () => {
  const [view, setView] = useSettings(s => [s.view, s.setView]);

  return (
    // @ts-ignore (View is "list" or "grid", but typescript doesn't know that)
    <Menubar.RadioGroup value={view} onValueChange={setView}>
      <Menubar.RadioItem value="list">List View</Menubar.RadioItem>
      <Menubar.RadioItem value="grid">Grid View</Menubar.RadioItem>
    </Menubar.RadioGroup>
  );
};

export { ViewTypeMenuItems };
