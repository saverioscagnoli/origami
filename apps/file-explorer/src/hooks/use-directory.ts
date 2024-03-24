import { DirectoryContext } from "@contexts/directory-context";
import { useContext } from "react";

const useDirectory = () => {
  const ctx = useContext(DirectoryContext);

  if (!ctx) {
    throw new Error("useDirectory must be used within a DirectoryProvider");
  }

  return ctx;
};

export { useDirectory };
