import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const { selected } = useCurrentDir();
  const { starEntries, unstarEntries } = useNavigation();

  const areStarred = useMemo(() => {
    const entries = selected().getEntries();
    return entries.every(e => e.isStarred);
  }, [selected()]);

  return (
    <ContextMenu.Item
      leftIcon={areStarred ? <StarIcon /> : <StarFilledIcon />}
      onClick={areStarred ? unstarEntries : starEntries}
    >
      {areStarred ? "Unstar" : "Star"}
    </ContextMenu.Item>
  );
};

export { StarUnstarMenuItem };
