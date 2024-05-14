import { invoke } from "@lib/mapped-invoke";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { create } from "zustand";

////////////////////////////////
//                            //
//   Current Directory Info   //
//                            //
////////////////////////////////

/**
 * This is the store for all the information related to the current open directory
 * in the user workspace.
 *
 * @interface CurrentDirStore
 *
 * @property {string} dir - The current directory path.
 * @property {function} setDir - A function to set the current directory path.
 * @property {DirEntry[]} entries - The list of entries in the current directory.
 * @property {function} setEntries - A function to set the list of entries in the current directory.
 * @property {function} replaceEntries - A function to replace an entry in the current directory.
 * @property {function} addEntries - A function to add entries to the current directory.
 * @property {function} removeEntries - A function to remove entries from the current directory.
 * @property {DirEntry[]} selected - The list of selected entries in the current directory.
 * @property {function} addSelected - A function to add an entry to the selected list.
 * @property {function} removeSelected - A function to remove an entry from the selected list.
 * @property {function} replaceSelected - A function to replace the selected list with a new entry.
 * @property {function} clearSelected - A function to clear the selected list.
 */

interface CurrentDirStore {
  dir: string;
  setDir: (dir: string) => void;
  entries: DirEntry[];
  setEntries: (entries: DirEntry[]) => void;
  replaceEntries: (entries: DirEntry[]) => void;
  addEntries: (entries: DirEntry[]) => void;
  removeEntries: (paths: string[]) => void;
  selected: DirEntry[];
  addSelected: (entry: DirEntry) => void;
  removeSelected: (entry: DirEntry) => void;
  replaceSelected: (entry: DirEntry[]) => void;
  clearSelected: () => void;
  history: string[];
  historyIndex: number;
  goBack: () => void;
  goForward: () => void;
}

const useCurrentDir = create<CurrentDirStore>()(set => ({
  dir: "",
  setDir: (dir: string, affectsHistory: boolean = true) =>
    set(state => {
      let newHistory = [...state.history];
      let newHistoryIndex = state.historyIndex;

      const existingIndex = newHistory.indexOf(dir);

      if (existingIndex !== -1) {
        newHistoryIndex = existingIndex;
      } else {
        if (newHistoryIndex !== newHistory.length - 1) {
          newHistory = newHistory.slice(0, newHistoryIndex + 1);
        }

        newHistory.push(dir);
        newHistoryIndex = newHistory.length - 1;
      }

      return { dir, history: newHistory, historyIndex: newHistoryIndex };
    }),
  entries: [],
  setEntries: entries => set({ entries }),
  replaceEntries: entries => {
    set(state => {
      const oldEntries = [...state.entries];

      for (const entry of entries) {
        const index = oldEntries.findIndex(e => e.path === entry.path);

        if (index !== -1) {
          oldEntries[index] = entry;
        }
      }

      return { entries: oldEntries };
    });
  },

  addEntries: entries =>
    set(state => {
      if (state.entries.every(e => !entries.some(en => en.path === e.path))) {
        return { entries: [...state.entries, ...entries] };
      }

      return state;
    }),
  removeEntries: paths =>
    set(state => ({ entries: state.entries.filter(e => !paths.includes(e.path)) })),
  selected: [],
  addSelected: entry =>
    set(state => {
      if (state.selected.findIndex(e => e.path === entry.path) === -1) {
        return { selected: [...state.selected, entry] };
      }

      return state;
    }),
  removeSelected: entry =>
    set(state => ({ selected: state.selected.filter(e => e.path !== entry.path) })),
  replaceSelected: entries => set({ selected: entries }),
  clearSelected: () => set({ selected: [] }),
  history: [],
  historyIndex: -1,
  goBack: () =>
    set(state => {
      if (state.historyIndex > 0) {
        const newHistoryIndex = state.historyIndex - 1;
        const newDir = state.history.at(newHistoryIndex);

        invoke(CommandName.ListDir, { dir: newDir });

        return {
          historyIndex: newHistoryIndex
        };
      }
    }),
  goForward: () =>
    set(state => {
      if (state.historyIndex < state.history.length - 1) {
        const newHistoryIndex = state.historyIndex + 1;
        const newDir = state.history.at(newHistoryIndex);

        invoke(CommandName.ListDir, { dir: newDir });

        return {
          historyIndex: newHistoryIndex
        };
      }
    })
}));

export { useCurrentDir };
