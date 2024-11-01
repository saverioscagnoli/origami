import React from "react";
import { cn } from "~/lib/utils";

type EntryLastModProps = {
  lastMod: string;
};

const EntryLastMod: React.FC<EntryLastModProps> = ({ lastMod }) => {
  return (
    <span className={cn("text-[--gray-8]", "whitespace-nowrap")}>
      {lastMod}
    </span>
  );
};

export { EntryLastMod };
