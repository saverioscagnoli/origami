import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { StarEntries, UnstarEntries } from "@wails/methods/fs/Filesystem";
import { useMemo } from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const StarUnstarMenuItem = () => {
  const selected = useCurrentDir(s => s.selected);

  const areStarred = useMemo(
    () => selected.every(e => e.IsStarred),
    [selected]
  );

  const onSelect = () => {
    if (areStarred) {
      const paths = selected.map(e => e.Path);

      UnstarEntries(paths);
    } else {
      StarEntries(selected);
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
