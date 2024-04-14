/* In this file there are the functions that should be executed when the app starts. */

import { useHotkey } from "@hooks/use-hotkey";
import { useNavigation } from "@hooks/use-navigation";
import { useSettings } from "@hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";
import { homeDir } from "@tauri-apps/api/path";
import { Command } from "@typings/command";
import { Modifier } from "@typings/modifier";
import { useEffect } from "react";

function setupFunctions() {
  const { cd } = useNavigation();

  useEffect(() => {
    homeDir().then(path => cd(path)());
    invoke(Command.InitEmitter);
  }, []);

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey([Modifier.Ctrl], "h", () => {
    showHidden.toggle();
  });

  useHotkey([Modifier.Ctrl], "j", () => {
    showCheckboxes.toggle();
  });
}

export { setupFunctions };
