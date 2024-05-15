import { ContextMenu } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const [selected, replaceselected] = useCurrentDir(state => [
    state.selected,
    state.replaceSelected
  ]);
  const areStarred = useMemo(() => selected.every(e => e.isStarred), [selected]);

  const onSelect = () => {
    const paths = selected.map(e => e.path);

    if (areStarred) {
      invoke(CommandName.UnstarEntries, { paths });
    } else {
      invoke(CommandName.StarEntries, { paths });
    }
  };

  return (
    <ContextMenu.Item
      leftIcon={areStarred ? <StarIcon /> : <StarFilledIcon />}
      onSelect={onSelect}
    >
      {areStarred ? "Unstar" : "Star"}
    </ContextMenu.Item>
  );
};

export { StarUnstarMenuItem };
