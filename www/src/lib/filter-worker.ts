import { fs } from "@wails/models";

onmessage = e => {
  let [entries, query] = e.data as [fs.DirEntry[], string];
  postMessage(
    entries.filter(entry =>
      entry.Name.toLowerCase().includes(query.toLowerCase())
    )
  );
};
