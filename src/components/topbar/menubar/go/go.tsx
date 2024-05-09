import { Menubar } from "@components/tredici";
import { BasicDirsMenuItems } from "./basic-dirs";
import { ParentDirectoryMenuItem } from "./parent";

const TopbarGoMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Go</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ParentDirectoryMenuItem />
        <Menubar.Separator />
        <BasicDirsMenuItems />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarGoMenu };
