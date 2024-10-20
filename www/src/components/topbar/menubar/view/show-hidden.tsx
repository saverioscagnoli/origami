import { Menubar } from "~/components/tredici";
import { useSettings } from "~/zustand/settings";

const ShowHiddenMenuItem = () => {
  const [showHidden, setShowHidden] = useSettings(state => [
    state.showHidden,
    state.setShowHidden
  ]);

  return (
    <Menubar.CheckboxItem
      shortcut="Ctrl + H"
      checked={showHidden}
      onCheckedChange={setShowHidden}
    >
      Show Hidden
    </Menubar.CheckboxItem>
  );
};

export { ShowHiddenMenuItem };
