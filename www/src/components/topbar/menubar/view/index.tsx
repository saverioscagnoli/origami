import React from "react";
import { Menubar } from "~/components/tredici";
import { ReloadItem } from "./reload";
import { ShowCheckboxesItem } from "./show-checkboxes";
import { ShowHiddenItem } from "./show-hidden";
import { ThemeItem } from "./theme";
import { ViewTypeItem } from "./view-type";

const ViewMenu: React.FC = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>View</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ReloadItem />
        <Menubar.Separator />
        <ShowHiddenItem />
        <ShowCheckboxesItem />
        <Menubar.Separator />
        <ThemeItem />
        <Menubar.Separator />
        <ViewTypeItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { ViewMenu };
