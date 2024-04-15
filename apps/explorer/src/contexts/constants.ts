import { Accessor } from "@typings/accessor";
import { createContext } from "react";

type ConstantsContextValue = {
  isVscodeInstalled: Accessor<boolean>;
};

const ConstantsContext = createContext<ConstantsContextValue | null>(null);

export { ConstantsContext };
