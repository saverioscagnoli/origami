import { Progress } from "@components/tredici";
import { cn } from "@lib/utils";
import { useState } from "react";

import ReactDOM from "react-dom/client";

import { useBackendEvent } from "@hooks/use-backend-event";
import { getCurrent } from "@tauri-apps/api/webview";
import { BackendEvent } from "@typings/enums";

import "../styles.css";

const Copy = () => {
  const [max, setMax] = useState<number>(0);
  const [value, setValue] = useState<number>(-1);
  const [time, setTime] = useState<number>(-1);

  useBackendEvent(BackendEvent.CopyProgress, info => {
    const [total, copied] = info;

    if (max === 0) {
      setMax(total);
    }

    setValue(copied);
  });

  useBackendEvent(BackendEvent.CopyOver, time => {
    getCurrent().close();

    setValue(1);
    setMax(1);
    setTime(time);
  });

  return (
    <div className={cn("w-screen h-screen", "grid place-items-center")}>
      {max !== 0 && (
        <Progress
          className={cn("w-5/6 h-10", "rounded-none")}
          indicatorClassName={cn("rounded-none")}
          max={max}
          value={value}
        />
      )}

      <div className={cn("w-1/2", "mt-2", "text-sm")}>
        {time !== -1 ? "Done!" : `${value} / ${max}`}
        {time !== -1 && <div>{time} seconds</div>}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Copy />);
