import { Accessor, Disk } from "@types";
import { createContext } from "react";

type DisksContextValue = {
  disks: Accessor<Disk[]>;
};

const DisksContext = createContext<DisksContextValue | null>(null);

export { DisksContext };
export type { DisksContextValue };