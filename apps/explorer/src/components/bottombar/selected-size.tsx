import { useAccessor } from "@hooks/use-accessor";
import { useCurrentDir } from "@hooks/use-current-dir";
import { whenChanges } from "@life-cycle";
import { invoke } from "@tauri-apps/api";
import { Progress } from "@tredici";
import { cn, formatSize } from "@utils";
import { useRef } from "react";

const SelectedSize = () => {
  const size = useAccessor<number>(0);

  const { selected } = useCurrentDir();
  const ref = useRef(selected.get());

  const changing = whenChanges([selected.get()], async () => {
    let folderSize = 0;

    if (JSON.stringify(ref.current) === JSON.stringify(selected.get())) {
      return;
    }

    ref.current = selected.get();

    for (let entry of selected.get()) {
      let n = await invoke<number>("get_file_size", { path: entry.path });

      folderSize += n;
    }

    size.set(folderSize);
  });

  return changing ? (
    <Progress className={cn("w-32 h-1")} indefinite />
  ) : (
    <p className={cn("text-xs")}>
      {selected.get().length === 0 ? "No items selected" : formatSize(size.get())}
    </p>
  );
};

export { SelectedSize };
