import React from "react";
import { Menubar } from "~/components/tredici";
import { EditMenu } from "./edit";
import { FileMenu } from "./file";
import { GoMenu } from "./go";
import { ViewMenu } from "./view";

const TopbarMenu: React.FC = () => {
  return (
    <Menubar>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <GoMenu />
    </Menubar>
  );
};

export { TopbarMenu };
