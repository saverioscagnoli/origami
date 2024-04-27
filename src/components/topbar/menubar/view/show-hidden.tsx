import { Menubar } from "@components/tredici";
import { useSettings } from "@contexts/settings";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const ShowHiddenMenuItem = () => {
  const { showHidden } = useSettings();

  const icon = useMemo(
    () => (showHidden() ? <EyeOpenIcon /> : <EyeClosedIcon />),
    [showHidden()]
  );

  return (
    <Menubar.CheckboxItem
      leftIcon={icon}
      checked={showHidden()}
      onCheckedChange={showHidden.set}
    >
      Show Hidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenMenuItem };
