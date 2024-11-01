import React from "react";
import { Menubar } from "~/components/tredici";
import { NewFileItem } from "./new-file";
import { NewFolderItem } from "./new-folder";
import { NewWindowItem } from "./new-window";

const FileMenu: React.FC = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>File</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <NewWindowItem />
        <Menubar.Separator />
        <NewFileItem />
        <NewFolderItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { FileMenu };
