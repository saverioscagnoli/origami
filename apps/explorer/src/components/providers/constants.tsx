import { ConstantsContext, ConstantsFromBackend } from "@contexts/constants";
import { useAccessor } from "@hooks/use-accessor";
import { useEvent } from "@hooks/use-event";
import { useProvider } from "@hooks/use-provider";

const ConstantsProvider = useProvider(ConstantsContext, () => {
  const isVscodeInstalled = useAccessor<boolean>(false);

  useEvent<ConstantsFromBackend>("send-constants", c => {
    isVscodeInstalled.set(c.is_vscode_installed);
    console.log(c);
  });

  return { isVscodeInstalled };
});

export { ConstantsProvider };
