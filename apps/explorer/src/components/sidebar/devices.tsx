import { For } from "@components/for";
import { useAccessor } from "@hooks/use-accessor";
import { Disk } from "@types";
import { Device } from "./device";
import { useEvent } from "@hooks/use-event";
import { cn } from "@utils";
import { useNavigation } from "@hooks/use-navigation";

const Devices = () => {
  const { changeDir } = useNavigation();
  const disks = useAccessor<Disk[]>([]);

  useEvent<Disk[]>("send-disks", disks.set);

  return (
    <div className={cn("flex flex-col", "mt-4")}>
      <p className={cn("px-2")}>Devices</p>
      <For of={disks.get()}>
        {(disk, i) => (
          <Device key={i} {...disk} onClick={changeDir(disk.mount_point)} />
        )}
      </For>
    </div>
  );
};

export { Devices };
