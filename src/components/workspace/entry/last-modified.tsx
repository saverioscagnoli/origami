import { cn } from "@lib/utils";
import { FC } from "react";

type EntryLastModifiedProps = {
  lastModified: string;
};

const EntryLastModified: FC<EntryLastModifiedProps> = ({ lastModified }) => {
  return (
    <span className={cn("text-[--gray-8]", "whitespace-nowrap")}>
      {lastModified}
    </span>
  );
};

export { EntryLastModified };