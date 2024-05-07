import { getCurrent } from "@tauri-apps/api/window";
import { TopbarButton } from "./button";
import { Cross1Icon, MinusIcon, SquareIcon } from "@components/icons";

const TopbarButtonGroup = () => {
  const win = getCurrent();

  const min = win.minimize;
  const toggle = win.toggleMaximize;
  const close = win.close;

  return (
    <div id="topbar-button-group">
      <TopbarButton
        id="topbar-button-minimize"
        icon={<MinusIcon />}
        onClick={min}
      />

      <TopbarButton
        id="topbar-button-toggle-maximize"
        icon={<SquareIcon />}
        onClick={toggle}
      />

      <TopbarButton
        id="topbar-button-close"
        icon={<Cross1Icon />}
        onClick={close}
        danger
      />
    </div>
  );
};

export { TopbarButtonGroup };
