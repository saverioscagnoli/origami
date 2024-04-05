import { cn } from "@utils";
import React from "react";

type EntryDateProps = {
  last_modified: string;
};

const EntryDate: React.FC<EntryDateProps> = ({ last_modified }) => {
  return <span className={cn("text-[--gray-10]")}>{last_modified}</span>;
};

export { EntryDate };
