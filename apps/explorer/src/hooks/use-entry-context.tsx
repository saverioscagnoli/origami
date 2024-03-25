import { EntryContext } from "@contexts/entry-context";
import { useContext } from "react";

const useEntryContext = () => {
  const ctx = useContext(EntryContext);

  if (!ctx) {
    throw new Error(
      "useEntryContext must be used within a EntryContextProvider"
    );
  }

  return ctx;
};

export { useEntryContext };
