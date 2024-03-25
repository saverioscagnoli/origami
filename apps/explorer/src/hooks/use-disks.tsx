import { DisksContext } from "@contexts/disks";
import { useContext } from "react";

const useDisks = () => {
  const ctx = useContext(DisksContext);

  if (!ctx) {
    throw new Error("useDisks must be used within a DisksProvider");
  }

  return ctx;
};

export { useDisks };
