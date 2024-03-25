import { DisksContext } from "@contexts/disks";
import { invoke } from "@tauri-apps/api";
import { Disk } from "@types";
import { toAccessor } from "@utils";
import { ReactNode, useEffect, useState } from "react";

type DisksProviderProps = {
  children: ReactNode;
};

const DisksProvider: React.FC<DisksProviderProps> = ({ children }) => {
  const [disks, setDisks] = useState<Disk[]>([]);

  useEffect(() => {
    invoke<Disk[]>("list_disks").then(setDisks);
  }, []);

  return (
    <DisksContext.Provider value={{ disks: toAccessor([disks, setDisks]) }}>
      {children}
    </DisksContext.Provider>
  );
};

export { DisksProvider };
