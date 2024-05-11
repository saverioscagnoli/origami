import { ContextMenu } from "@components/tredici";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const [selected,replaceselected] = useCurrentDir(state => [state.selected,state.replaceSelected]);
  const areStarred = useMemo(() => selected.every(e => e.isStarred), [selected]);

  const push = useCallstack(state => state.push);

  const onSelect = () => {
    const paths = selected.map(e => e.path);

    if (areStarred) {
      push(CommandName.UnstarEntries, { paths });
    } else {
      push(CommandName.StarEntries, { paths });
      replaceselected(selected.map(e => ({ ...e, isStarred: true })));
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
