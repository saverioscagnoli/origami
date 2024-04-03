import React from "react";
import { Entry as EntryT } from "@types";
import { Entry } from "./entry";
import { ListChildComponentProps } from "react-window";
import { EntryContextMenu } from "./entry/context-menu/context-menu";

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
    <EntryContextMenu>
      <Entry
        {...entry}
        style={style}
        onClick={onClick(entry)}
        onDoubleClick={onDoubleClick(entry)}
      />
    </EntryContextMenu>
  );
};

export { Row };
