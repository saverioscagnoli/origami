import React from "react";
import { Entry as EntryT } from "@types";
import { Entry } from "./entry";
import { ListChildComponentProps } from "react-window";

type RowProps = ListChildComponentProps<{
  entries: EntryT[];
  onClick: (
    entry: EntryT
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDoubleClick: (entry: EntryT) => () => Promise<void>;
}>;

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { entries, onClick, onDoubleClick } = data;
  const entry = entries[index];

  return (
    <Entry
      {...entry}
      style={style}
      onClick={onClick(entry)}
      onDoubleClick={onDoubleClick(entry)}
    />
  );
};

export { Row };