import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useNavigation } from "@contexts/navigation";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const StarUnstarMenuItem = () => {
  const { selected } = useCurrentDir();

  const areStarred = useMemo(() => false, [selected()]);

  return (
    <ContextMenu.Item leftIcon={areStarred ? <StarIcon /> : <StarFilledIcon />}>
      {areStarred ? "Unstar" : "Star"}
    </ContextMenu.Item>
  );
};

export { StarUnstarMenuItem };
