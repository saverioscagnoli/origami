import { DirEntry } from "@typings/dir-entry";

onmessage = e => {
  let [entries, query] = e.data as [DirEntry[], string];
  postMessage(
    entries.filter(entry => entry.name.toLowerCase().includes(query.toLowerCase()))
  );
};
