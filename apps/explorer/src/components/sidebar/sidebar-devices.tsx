import { Progress } from "@tredici";
import { useDisks } from "@hooks/use-disks";
import { cn } from "@utils";
import { BackpackIcon } from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";

const SidebarDevices = () => {
  const { changeDir } = useDirectory();
  const { disks } = useDisks();

  const onClick = (mount: string) => () => {
    changeDir(mount);
  };

  return (
    <div className={cn("mt-4")}>
      <p className={cn("px-3")}>Devices</p>
      <div>
        {disks.get().map(d => (
          <div
            key={d.mount_point}
            className={cn(
              "flex flex-col items-center gap-1",
              "mt-1",
              "px-4 py-1.5",
              "cursor-pointer",
              "hover:bg-[--gray-3]",
              "select-none"
            )}
            onClick={onClick(d.mount_point)}
          >
            <div className={cn("w-full", "flex", "justify-between")}>
              <span className={cn("flex items-center gap-2", "self-start")}>
                <BackpackIcon />
                <p>{d.mount_point}</p>
              </span>
              <p className={cn("text-sm")}>{d.total} GB</p>
            </div>
            <Progress
              className={cn("w-full")}
              max={d.total}
              value={d.total - d.free}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { SidebarDevices };
