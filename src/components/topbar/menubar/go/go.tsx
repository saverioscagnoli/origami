import { Menubar } from "@components/tredici";
import { BasicDirsMenuItems } from "./basic-dirs";

const TopbarGoMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Go</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <BasicDirsMenuItems />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarGoMenu };
