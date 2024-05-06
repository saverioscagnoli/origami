import { Progress } from "@components/tredici";
import { cn } from "@lib/utils";
import { useMemo, useState } from "react";

import { useBackendEvent } from "@hooks/use-backend-event";
import { BackendEvent, Command, WindowLabel } from "@typings/enums";

import ReactDOM from "react-dom/client";

import { invoke } from "@lib/mapped-invoke";
import "../styles.css";

import vineBoom from "../assets/vine-boom.mp3";

const Copy = () => {
  const [max, setMax] = useState<number>(0);
  const [value, setValue] = useState<number>(-1);
  const [time, setTime] = useState<number>(-1);

  const [readRate, setReadRate] = useState<number>(0);

  const audio = useMemo(() => new Audio(vineBoom), []);

  useBackendEvent(BackendEvent.CopyProgress, info => {
    const { totalBytes, copiedBytes, readRate } = info;

    if (max === 0) {
      setMax(totalBytes);
    }

    setReadRate(readRate);
    setValue(copiedBytes);
  });

  useBackendEvent(BackendEvent.CopyOver, time => {
    audio.play();

    setTimeout(() => invoke(Command.CloseWindow, { label: WindowLabel.Copy }), 3000);

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
        {readRate !== 0 && <div>{readRate} MB/s</div>}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Copy />);
