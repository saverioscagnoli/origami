import { ContextMenu } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const { selected } = useCurrentDir();
  const { starEntries, unstarEntries } = useCommands();

  const areStarred = useMemo(() => selected.every(e => e.isStarred), [selected]);

  const onSelect = () => {
    const paths = selected.map(e => e.path);

    if (areStarred) {
      unstarEntries(paths);
    } else {
      starEntries(paths);
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
