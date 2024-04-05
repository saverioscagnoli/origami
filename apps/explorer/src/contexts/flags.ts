import { Accessor } from "@types";
import { createContext } from "react";

// To change with a useSettings maybe?

type FlagsContextValue = {
  showHidden: Accessor<boolean>;
};

const FlagsContext = createContext<FlagsContextValue | null>(null);

export { FlagsContext };
