import React from "react";

type ForProps<T> = {
  of: T[];
  children: (item: T, index: number) => React.ReactNode;
};

const For = <T,>({ of, children }: ForProps<T>) => {
  return (
    <>
      {of.map((item, index) => (
        <React.Fragment key={index}>{children(item, index)}</React.Fragment>
      ))}
    </>
  );
};

export { For };
