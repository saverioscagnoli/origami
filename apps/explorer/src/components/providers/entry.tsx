import { EntryContext } from "@contexts/entry-context";
import { toAccessor } from "@utils";
import React, { ReactNode, useState } from "react";

type EntryContextProviderProps = {
  children: ReactNode;
};

const EntryContextProvider: React.FC<EntryContextProviderProps> = ({
  children
}) => {
  const renamingState = useState<boolean>(false);

  return (
    <EntryContext.Provider value={{ renaming: toAccessor(renamingState) }}>
      {children}
    </EntryContext.Provider>
  );
};

export { EntryContextProvider };
