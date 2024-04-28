import { Menubar } from "@components/tredici";
import { CutMenuItem } from "./cut";
import { CopyMenuItem } from "./copy";
import { PasteMenuItem } from "./paste";
import { RenameMenuItem } from "./rename";
import { DeleteMenuItem } from "./delete";
import { SelectAllMenuItem } from "./select-all";

const TopbarEditMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Edit</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <CutMenuItem />
        <CopyMenuItem />
        <PasteMenuItem />
        <Menubar.Separator />
        <RenameMenuItem />
        <DeleteMenuItem />
        <Menubar.Separator />
        <SelectAllMenuItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarEditMenu };
