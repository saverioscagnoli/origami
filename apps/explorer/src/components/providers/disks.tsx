import { DisksContext } from "@contexts/disks";
import { useEvent } from "@hooks/use-event";
import { Disk } from "@types";
import { toAccessor } from "@utils";
import { ReactNode, useState } from "react";

type DisksProviderProps = {
  children: ReactNode;
};

const DisksProvider: React.FC<DisksProviderProps> = ({ children }) => {
  const [disks, setDisks] = useState<Disk[]>([]);

  useEvent<Disk[]>("send-disks", (d) => {
    setDisks(d);
  }) ;

  return (
    <DisksContext.Provider value={{ disks: toAccessor([disks, setDisks]) }}>
      {children}
    </DisksContext.Provider>
  );
};

export { DisksProvider };
