import { useCommandResponse } from "@hooks/use-command-response";
import { loadCSS } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { useGlobalStates } from "@zustand/global-states-store";

function loadCSSModulesListen() {
  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(CommandName.LoadCSSModules, payload => {
    const [modules, error] = payload;

    if (error) {
      setError(error);
      return;
    }

    modules.forEach(loadCSS);
    console.info(modules.length + " CSS modules loaded.");
  });
}

export { loadCSSModulesListen };
