import { ConstantsContext } from "@contexts/constants";
import { useAccessor } from "@hooks/use-accessor";
import { createContextProvider } from "@lib/utils";

const ConstantsProvider = createContextProvider(ConstantsContext, () => {
  const isVscodeInstalled = useAccessor<boolean>(false);
  const isWindowsTerminalInstalled = useAccessor<boolean>(false);

  return { isVscodeInstalled, isWindowsTerminalInstalled };
});

export { ConstantsProvider };
