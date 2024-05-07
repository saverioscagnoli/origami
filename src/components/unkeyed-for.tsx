import { JSX } from "solid-js";

type UnkeyedForProps<T> = {
  each: T[];
  children: (item: T, index: number) => JSX.Element;
};

const UnkeyedFor = <T,>({ each, children }: UnkeyedForProps<T>) => {
  return <>{each.map(children)}</>;
};

export { UnkeyedFor };
