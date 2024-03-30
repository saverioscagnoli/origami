import { EntryContext } from "@contexts/entry-context";
import { DirEntry } from "@types";
import { toAccessor } from "@utils";
import React, { ReactNode, useState } from "react";

type EntryContextProviderProps = {
  entry: DirEntry;
  children: ReactNode;
};

const EntryContextProvider: React.FC<EntryContextProviderProps> = ({
  children,
  entry
}) => {
  const renamingState = useState<boolean>(false);

  return (
    <EntryContext.Provider
      value={{
        entry,
        renaming: toAccessor(renamingState)
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export { EntryContextProvider };
