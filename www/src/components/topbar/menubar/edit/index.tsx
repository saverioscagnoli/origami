import React from "react";
import { Menubar } from "~/components/tredici";
import { CopyItem } from "./copy";
import { CutItem } from "./cut";
import { DeleteItem } from "./delete";
import { PasteItem } from "./paste";
import { RenameItem } from "./rename";
import { SelectAllItem } from "./select-all";

const EditMenu: React.FC = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Edit</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <CutItem />
        <CopyItem />
        <PasteItem />
        <Menubar.Separator />
        <RenameItem />
        <DeleteItem />
        <Menubar.Separator />
        <SelectAllItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { EditMenu };
