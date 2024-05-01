import { Menubar } from "@components/tredici";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const ShowHiddenMenuItem = () => {
  const { showHidden } = useSettings();
  const { updateSettings } = useDispatchers();

  const icon = useMemo(
    () => (showHidden ? <EyeOpenIcon /> : <EyeClosedIcon />),
    [showHidden]
  );

  const onCheckedChange = (checked: boolean) => {
    updateSettings({ showHidden: checked });
  };

  return (
    <Menubar.CheckboxItem
      leftIcon={icon}
      checked={showHidden}
      onCheckedChange={onCheckedChange}
    >
      Show Hidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenMenuItem };
