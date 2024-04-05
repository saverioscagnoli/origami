import { FlagsContext } from "@contexts/flags";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";

const FlagsProvider = useProvider(FlagsContext, () => {
  const showHidden = useAccessor<boolean>(false);

  return { showHidden };
});

export { FlagsProvider };
