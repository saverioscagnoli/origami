import { useCommandResponse } from "@hooks/use-command-response";
import { loadCSS } from "@lib/utils";
import { CommandName } from "@typings/enums";

function loadCSSModulesListen() {
  useCommandResponse(CommandName.LoadCSSModules, payload => {
    const [modules, error] = payload;

    if (error) {
      alert(error);
      return;
    }

    modules.forEach(loadCSS);
    console.info(modules.length + " CSS modules loaded.");
  });
}

export { loadCSSModulesListen };
