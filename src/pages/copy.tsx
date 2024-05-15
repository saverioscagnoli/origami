import { Progress } from "@components/tredici";
import { useBackendEvent } from "@hooks/use-backend-event";
import { useFrontendEvent } from "@hooks/use-frontend-event";
import { invoke } from "@lib/mapped-invoke";
import { cn, percentage } from "@lib/utils";
import { convertFileSrc } from "@tauri-apps/api/core";
import { BackendEvent, CommandName, FrontendEvent } from "@typings/enums";
import { useConfig } from "@zustand/config-store";
import { ThemeWatcher, useSettings } from "@zustand/settings-store";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import "../styles.css";

const Copy = () => {
  const [max, setMax] = useState<number>(0);
  const [value, setValue] = useState<number>(-1);
  const [rate, setRate] = useState<number>(0);
  const [time, setTime] = useState<number>(-1);

  const [audio, setAudio] = useState<HTMLAudioElement[]>([]);

  const [config, loadConfig] = useConfig(state => [state.config, state.loadConfig]);

  /**
   * Load the config on mount.
   */
  useEffect(() => {
    invoke(CommandName.LoadConfig).then(loadConfig);
  }, []);

  /**
   * Load and prepare audio files for notifications.
   */
  useEffect(() => {
    if (!config) return;

    const notifyAudioPaths = config.notifications?.copy?.paths;
    const notifyAudios = notifyAudioPaths?.map(
      path => new Audio(convertFileSrc(path))
    );
    setAudio(notifyAudios);
  }, [config]);

  const setTheme = useSettings(state => state.setTheme);

  useFrontendEvent(FrontendEvent.ThemeChange, theme => {
    setTheme(theme);
  });

  /**
   * This doenst work i dont know why I hate my life
   */
  useBackendEvent(BackendEvent.CopyStart, theme => {
    setTheme(theme);
  });

  useBackendEvent(
    BackendEvent.CopyProgress,
    info => {
      const [total, copied, rate] = info;

      if (max === 0) {
        setMax(total);
      }

      setValue(copied);
      setRate(rate);
    },
    [max]
  );

  useBackendEvent(
    BackendEvent.CopyOver,
    time => {
      setValue(1);
      setMax(1);
      setTime(time);

      audio.forEach(a => a.play());
    },
    [audio, config]
  );

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "flex flex-col items-center justify-center gap-4"
      )}
    >
      {max !== 0 && (
        <Progress
          className={cn("w-5/6 h-10", "rounded-none")}
          indicatorClassName={cn("rounded-none")}
          max={max}
          value={value}
        />
      )}

      <div
        className={cn(
          "w-1/2",
          "flex flex-col items-center gap-1",
          "whitespace-nowrap"
        )}
      >
        <span className={cn("flex gap-2")}>
          <p>Progress: </p>
          <p>
            {value} / {max}
          </p>
        </span>
        <span>
          <p>{percentage(value, max)}</p>
        </span>
        <span>
          <p>Speed: {rate} MB/s</p>
        </span>
        {time !== -1 && (
          <span>
            Done in:{" "}
            {time < 1
              ? `${(time * 1000).toFixed()} milliseconds`
              : `${time.toFixed()} seconds`}
          </span>
        )}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeWatcher>
    <Copy />
  </ThemeWatcher>
);
