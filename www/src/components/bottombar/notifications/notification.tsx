import { useState } from "react";
import { Progress } from "~/components/tredici";
import { useWailsEvent } from "~/hooks/use-wails-events";
import { cn } from "~/lib/utils";

type NotificationProps = {
  id: string;
  name: string;
  dst: string;
};

const Notification: React.FC<NotificationProps> = ({ id, name, dst }) => {
  const [copied, setCopied] = useState<number>(0);
  const [total, setTotal] = useState<number>(1);

  useWailsEvent("f:progress", ([[copied, total], notID]) => {
    if (notID !== id) return;

    setCopied(copied);
    setTotal(total);
  });

  return (
    <div
      key={id}
      className={cn(
        "w-fit h-fit",
        "flex flex-col gap-2",
        "p-2",
        "items-center"
      )}
    >
      <p className={cn("text-sm truncate", "text-center")}>
        Copying {name} to {dst}...
      </p>
      <div className={cn("w-full", "flex flex-col items-center")}>
        <span
          className={cn("w-full", "flex items-center justify-center gap-4")}
        >
          <Progress
            className={cn("h-3", "rounded-sm")}
            indicatorClassName={cn("rounded-sm")}
            value={copied}
            max={total}
          />
          <p>{((copied / total) * 100).toFixed(0)}%</p>
        </span>
        <p className={cn("text-center")}>
          ({copied} / {total}) bytes
        </p>
      </div>
    </div>
  );
};

export { Notification };
