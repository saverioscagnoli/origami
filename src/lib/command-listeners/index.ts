import { createEntryListen } from "./create-entry";
import { deleteEntriesListen } from "./delete-entries";
import { listDirListen } from "./list-dir";

////////////////////////////////
//                            //
//     Command Listeners      //
//                            //
////////////////////////////////

/**
 * This is the file where all the command listeners are started.
 *
 * Command listeners are provided bt the `useCommandResponse` hook.
 * Each command that should have its response handled, should have a listener here.
 *
 * For example the list dir command, here is where the entries in the workspace are updated.
 */

function startCommandListeners() {
  listDirListen();
  createEntryListen();
  deleteEntriesListen();
}

export { startCommandListeners };