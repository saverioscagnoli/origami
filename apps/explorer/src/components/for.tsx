import { ReactNode } from "react";

type ForProps<T> = {
  of: T[];
  children: (item: T, index: number) => ReactNode;
};

const For = <T,>({ of, children }: ForProps<T>) => {
  return <>{of.map(children)}</>;
};

export { For };
