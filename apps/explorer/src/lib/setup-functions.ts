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

  const { dir, entries, selected } = useCurrentDir();
  const { cutting, copying, renaming } = useGlobalStates();

  useHotkey(
    [Modifier.Ctrl],
    "x",
    e => {
      e.preventDefault();
      e.stopPropagation();

      cutting.set(selected());
      copying.reset();
    },
    [selected()]
  );

  useHotkey(
    [Modifier.Ctrl],
    "c",
    e => {
      e.preventDefault();
      e.stopPropagation();

      copying.set(selected());
      cutting.reset();
    },
    [selected()]
  );

  useHotkey(
    [Modifier.Ctrl],
    "v",
    e => {
      e.preventDefault();
      e.stopPropagation();

      if (cutting() !== null) {
        cutEntries();
      } else if (copying() !== null) {
        copyEntries();
      }
    },
    [selected(), cutting(), copying()]
  );

  useHotkey(
    [Modifier.Ctrl],
    "a",
    e => {
      if (renaming().every(v => v === null)) {
        e.preventDefault();
        e.stopPropagation();

        selected.set(entries());
      }
    },
    [dir(), selected(), renaming()]
  );

  useHotkey(
    [],
    "F2",
    e => {
      e.preventDefault();
      e.stopPropagation();

      const [path, name] = selected().getKeyValues()[0];
      renaming.set([path, name]);
    },
    [selected()]
  );

  useHotkey(
    [],
    "Delete",
    e => {
      e.preventDefault();
      e.stopPropagation();
      deleteEntries();
    },
    [selected()]
  );

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey([Modifier.Ctrl], "h", e => {
    e.preventDefault();
    e.stopPropagation();

    showHidden.toggle();
  });

  useHotkey([Modifier.Ctrl], "j", e => {
    e.preventDefault();
    e.stopPropagation();

    showCheckboxes.toggle();
  });
}

export { setupFunctions };
