import { Menubar } from "@tredici";
import { NewFile } from "./new-file";
import { NewFolder } from "./new-folder";
import { Back } from "./back";
import { Forward } from "./forward";
import { ShowHidden } from "./show-hidden";
import { FindInFolder } from "./find-in-folder";
import { useAccessor } from "@hooks/use-accessor";
import { Theme } from "./theme";

const TopbarMenu = () => {
  const showHidden = useAccessor<boolean>(false);

  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content sideOffset={10} onCloseAutoFocus={e => e.preventDefault()}>
          <NewFile />
          <NewFolder />
          <Menubar.Separator />
          <Back />
          <Forward />
          <Menubar.Separator />
          <Theme />
          <ShowHidden showHidden={showHidden} />
          <Menubar.Separator />
          <FindInFolder />
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };