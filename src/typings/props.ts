import { ReactNode, SVGAttributes } from "react";

type ChildrenProps = {
  children: ReactNode;
};

interface IconProps extends SVGAttributes<SVGElement> {
  children?: ReactNode;
  color?: string;
}

export type { ChildrenProps, IconProps };
