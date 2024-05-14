import { Menubar } from "@components/tredici";
import { BackMenuItem } from "./back";
import { BasicDirsMenuItems } from "./basic-dirs";
import { ForwardMenuItem } from "./forward";
import { ParentDirectoryMenuItem } from "./parent";

const TopbarGoMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Go</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ParentDirectoryMenuItem />
        <Menubar.Separator />
        <BackMenuItem />
        <ForwardMenuItem />
        <Menubar.Separator />
        <BasicDirsMenuItems />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarGoMenu };
