////////////////////////////////
//                            //
//      Hotkey Listeners      //
//                            //
////////////////////////////////

import { createNewDirHotkey } from "./create-dir";
import { createNewFileHotkey } from "./create-file";
import { deleteEntriesHotkey } from "./delete-entries";
import { reloadHotkey } from "./reload";
import { renameEntryHotkey } from "./rename-entry";
import { selectAllHotkey } from "./select-all";
import { toggleCheckboxesHotkey } from "./toggle-checkboxes";
import { toggleHiddenHotkey } from "./toggle-hidden";

/**
 * This is a file where all the hotkey listeners are started.
 * Each hotkey has its own listener (document "keydown" event listener).
 *
 * For example, The ctrl + a hotkey, here is where the logic is defined.
 */

function startHotkeyListeners() {
  selectAllHotkey();
  createNewFileHotkey();
  createNewDirHotkey();
  deleteEntriesHotkey();
  reloadHotkey();
  toggleHiddenHotkey();
  toggleCheckboxesHotkey();
  renameEntryHotkey();
}

export { startHotkeyListeners };
