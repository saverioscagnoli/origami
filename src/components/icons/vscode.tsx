import { VSCODE_ICON_BASE64 } from "@lib/consts";
import { FC } from "react";

type VscodeIconProps = {
  size?: number;
};

const VscodeIcon: FC<VscodeIconProps> = ({ size = 15 }) => {
  return (
    <img
      width={size}
      height={size}
      src={`data:image/png;base64,${VSCODE_ICON_BASE64}`}
    />
  );
};

export { VscodeIcon };
