import { useSettings } from "@contexts/settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  // const { dir, entries, selected } = useCurrentDir();

  // useHotkey(
  //   [Modifier.Ctrl],
  //   Key.KeyA,
  //   e => {
  //     if (e.repeat) return;
  //     selected.set(entries());
  //   },
  //   [entries()]
  // );

  // const { showHidden, showCheckboxes } = useSettings();

  // useHotkey([Modifier.Ctrl], Key.KeyH, e => {
  //   if (e.repeat) return;
  //   showHidden.toggle();
  // });
  
  // useHotkey([Modifier.Ctrl], Key.KeyJ, e => {
  //   if (e.repeat) return;
  //   showCheckboxes.toggle();
  // });
}

export { setupHotkeys };
