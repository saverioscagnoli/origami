import { ReactNode } from "react";

type ChildrenProps = {
  children: ReactNode;
};

type SizeProps = {
  size: number;
};

type PreviewProps = {
  path: string;
  ext: string;
};

export type { ChildrenProps, PreviewProps, SizeProps };
