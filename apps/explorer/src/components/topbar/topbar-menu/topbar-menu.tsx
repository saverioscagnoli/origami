import { Menubar } from "@tredici";
import { NewFile } from "./new-file";
import { NewFolder } from "./new-folder";
import { Back } from "./back";
import { Forward } from "./forward";
import { ShowHidden } from "./show-hidden";
import { FindInFolder } from "./find-in-folder";
import { Theme } from "./theme";
import { NewWindow } from "./new-window";

const TopbarMenu = () => {
  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content sideOffset={10} onCloseAutoFocus={e => e.preventDefault()}>
          <NewWindow />
          <Menubar.Separator />
          <NewFile />
          <NewFolder />
          <Menubar.Separator />
          <Back />
          <Forward />
          <Menubar.Separator />
          <Theme />
          <ShowHidden />
          <Menubar.Separator />
          <FindInFolder />
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
