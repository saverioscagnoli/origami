import { WT_ICON_BASE64 } from "@lib/consts";
import { FC } from "react";

type WindowsTerminalIconProps = {
  size?: number;
};

const WindowsTerminalIcon: FC<WindowsTerminalIconProps> = ({ size = 15 }) => {
  return (
    <img
      width={size}
      height={size}
      src={`data:image/png;base64,${WT_ICON_BASE64}`}
    />
  );
};

export { WindowsTerminalIcon };
