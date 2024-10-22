import React from "react";

type ForProps<T> = {
  of: T[];
  fallback?: React.ReactNode;
  children: (item: T, index: number) => React.ReactNode;
};

const For = <T,>({ of, fallback, children }: ForProps<T>) => {
  return (
    <>
      {of.length === 0
        ? fallback
        : of.map((item, index) => (
            <React.Fragment key={index}>{children(item, index)}</React.Fragment>
          ))}
    </>
  );
};

export { For };
