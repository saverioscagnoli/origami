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
  onContextMenu: (
    entry: EntryT
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}>;

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { entries, onClick, onDoubleClick, onContextMenu } = data;
  const entry = entries[index];

  return (
    <EntryContextMenu>
      <Entry
        {...entry}
        style={style}
        onClick={onClick(entry)}
        onDoubleClick={onDoubleClick(entry)}
        onContextMenu={onContextMenu(entry)}
      />
    </EntryContextMenu>
  );
};

export { Row };
