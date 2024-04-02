import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";
import { Accessor } from "@types";
import React from "react";

const ShowHidden: React.FC<{ showHidden: Accessor<boolean> }> = ({ showHidden }) => {
  return (
    <Menubar.CheckboxItem
      checked={showHidden.get()}
      onCheckedChange={showHidden.set}
      leftIcon={showHidden.get() ? <EyeOpenIcon /> : <EyeClosedIcon />}
    >
      Show Hidden Items
    </Menubar.CheckboxItem>
  );
};

export { ShowHidden };
