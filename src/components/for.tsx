type ForProps<T> = {
  of: T[];
  children: (item: T, index: number) => JSX.Element;
};

const For = <T,>({ of, children }: ForProps<T>) => {
  return <>{of.map((item, index) => children(item, index))}</>;
};

export { For };
