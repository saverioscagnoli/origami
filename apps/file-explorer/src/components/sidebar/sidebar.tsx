import { invoke } from "@tauri-apps/api";
import { cn } from "@utils";
import { useEffect, useState } from "react";
import { Disk } from "./disk";

type TDisk = {
  available_space: number;
  total_space: number;
};

const Sidebar = () => {
  const [disks, setDisks] = useState<TDisk[]>([]);

  useEffect(() => {
    invoke<TDisk[]>("list_disks").then(setDisks);
  }, []);

  return (
    <div className={cn("w-1/6 h-full", "border-r border-r-[--gray-3]")}>
      {disks.map(d => (
        <Disk
          key={d.available_space}
          available_space={d.available_space}
          total_space={d.total_space}
        />
      ))}
    </div>
  );
};

export { Sidebar };
export type { TDisk };
