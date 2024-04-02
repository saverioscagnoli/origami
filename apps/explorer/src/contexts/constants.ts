import { Accessor } from "@types";
import { createContext } from "react";

type Constants = {
  isVscodeInstalled: Accessor<boolean>;
};

type ConstantsFromBackend = {
  is_vscode_installed: boolean;
};

const ConstantsContext = createContext<Constants | null>(null);

export { ConstantsContext };
export type { Constants, ConstantsFromBackend };
