import { Menubar } from "~/components/tredici";
import { FilterMenuItems } from "./filter";
import { ReloadMenuItem } from "./reload";
import { ShowCheckboxesMenuItem } from "./show-checkboxes";
import { ShowHiddenMenuItem } from "./show-hidden";
import { ThemeMenuItem } from "./theme";
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
        <Menubar.Separator />
        <FilterMenuItems />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarViewMenu };
