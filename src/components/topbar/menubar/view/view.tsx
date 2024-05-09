import { Menubar } from "@components/tredici";
import { ReloadMenuItem } from "./reload";
import { ThemeMenuItem } from "./theme";
import { ShowHiddenMenuItem } from "./show-hidden";
import { ShowCheckboxesMenuItem } from "./show-checkboxes";
import { ViewTypeMenuItems } from "./view-type";

const TopbarViewMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>View</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ReloadMenuItem />
        <Menubar.Separator />
        <ShowHiddenMenuItem />
        <ShowCheckboxesMenuItem />
        <Menubar.Separator />
        <ThemeMenuItem />
        <Menubar.Separator />
        <ViewTypeMenuItems />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarViewMenu };
