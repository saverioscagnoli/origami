import { TrashIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const DeleteItem: React.FC = () => {
  return (
    <Menubar.Item leftIcon={<TrashIcon />} colorScheme="red">
      Delete
    </Menubar.Item>
  );
};

export { DeleteItem };
