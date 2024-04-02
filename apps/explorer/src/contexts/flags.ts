import { Accessor } from "@types";
import { createContext } from "react";

type FlagsContextValue = {
  showHidden: Accessor<boolean>;
};

const FlagsContext = createContext<FlagsContextValue | null>(null);

export { FlagsContext };
