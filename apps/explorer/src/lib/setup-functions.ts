/* In this file there are the functions that should be executed when the app starts. */

import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useHotkey } from "@hooks/use-hotkey";
import { useNavigation } from "@hooks/use-navigation";
import { useSettings } from "@hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";
import { homeDir } from "@tauri-apps/api/path";
import { Command } from "@typings/command";
import { Modifier } from "@typings/modifier";
import { useEffect } from "react";

function setupFunctions() {
  const { cd, cutEntries, copyEntries, deleteEntries } = useNavigation();

  useEffect(() => {
    homeDir().then(path => cd(path)());
    invoke(Command.InitEmitter);
  }, []);

  const { selected } = useCurrentDir();
  const { cutting, copying, renaming } = useGlobalStates();

  useHotkey(
    [Modifier.Ctrl],
    "x",
    () => {
      cutting.set(selected());
      copying.reset();
    },
    [selected()]
  );

  useHotkey(
    [Modifier.Ctrl],
    "c",
    () => {
      copying.set(selected());
      cutting.reset();
    },
    [selected()]
  );

  useHotkey(
    [Modifier.Ctrl],
    "v",
    () => {
      if (cutting() !== null) {
        cutEntries();
      } else if (copying() !== null) {
        copyEntries();
      }
    },
    [selected(), cutting(), copying()]
  );

  useHotkey(
    [],
    "F2",
    () => {
      const [path, name] = selected().getKeyValues()[0];
      renaming.set([path, name]);
    },
    [selected()]
  );

  useHotkey([], "Delete", () => deleteEntries(), [selected()]);

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey([Modifier.Ctrl], "h", () => {
    showHidden.toggle();
  });

  useHotkey([Modifier.Ctrl], "j", () => {
    showCheckboxes.toggle();
  });
}

export { setupFunctions };
