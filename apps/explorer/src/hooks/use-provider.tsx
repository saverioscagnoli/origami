import { ChildrenProps } from "@types";
import React, { Context } from "react";

const useProvider = <T,>(
  Context: Context<T>,
  funcs: () => T
): React.FC<ChildrenProps> => {
  return ({ children }) => {
    const value = funcs();

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
};

export { useProvider };
