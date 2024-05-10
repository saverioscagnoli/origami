import { ContextMenu } from "@components/tredici";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const areStarred = useMemo(() => selected.every(e => e.isStarred), [selected]);

  return (
    <ContextMenu.Item leftIcon={areStarred ? <StarIcon /> : <StarFilledIcon />}>
      {areStarred ? "Unstar" : "Star"}
    </ContextMenu.Item>
  );
};

export { StarUnstarMenuItem };
