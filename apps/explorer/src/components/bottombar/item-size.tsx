import { Progress } from "@components/tredici";
import { useAccessor } from "@hooks/use-accessor";
import { useCurrentDir } from "@hooks/use-current-dir";
import { cn, formatBytes } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { Command } from "@typings/command";
import { EventToBackend } from "@typings/events";
import { useEffect } from "react";

const BottombarItemSize = () => {
  const { selected } = useCurrentDir();
  const size = useAccessor<number>(0);
  const calculating = useAccessor<boolean>(false);

  const calc = async () => {
    let n = 0;

    for (const path of selected().getPaths()) {
      n += await invoke<number>(Command.CalcSize, { path });
    }

    size.set(n);
  };

  useEffect(() => {
    const calculateSize = async () => {
      await emit(EventToBackend.StopCalculatingSize);
      if (selected().size > 0) {
        calculating.on();
        await calc();
        calculating.off();
      }
    };

    calculateSize();
  }, [selected()]);

  return (
    <span>
      {calculating() ? (
        <Progress className={cn("w-32 h-1")} indefinite />
      ) : (
        formatBytes(size())
      )}
    </span>
  );
};

export { BottombarItemSize };
