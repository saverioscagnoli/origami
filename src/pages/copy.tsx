import { TopbarButton } from "@components/topbar/button-group/button";
import { Progress, Spinner } from "@components/tredici";
import { useBackendEvent } from "@hooks/use-backend-event";
import { useFrontendEvent } from "@hooks/use-frontend-event";
import { invoke } from "@lib/mapped-invoke";
import { cn, formatBytes, percentage } from "@lib/utils";
import { Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import { convertFileSrc } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
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
   * Get the the formats for the progress bar from the config.
   * If not found, use the default formats.
   * @see @lib/utils.ts - formatBytes
   */
  const copiedUnit = config?.styles?.copy?.progress?.units?.copied;
  const totalUnit = config?.styles?.copy?.progress?.units?.total;

  /**
   * Parse the format from the config, if not found use the default format.
   */
  const format =
    config?.styles?.copy?.progress?.format ??
    "{copied} / {total} ({percentage}) \n {rate}";

  /**
   * Format the progress bar with the values.
   */
  const toDisplay = format
    .replace("{copied}", formatBytes(value, { format: copiedUnit }))
    .replace("{total}", formatBytes(max, { format: totalUnit }))
    .replace("{rate}", `${rate} MB/s`)
    .replace("{percentage}", percentage(value, max));

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

    const audioPaths = config.notifications?.copy?.paths;
    const audios = audioPaths?.map(path => new Audio(convertFileSrc(path)));
    setAudio(audios);
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
      setValue(max);
      setTime(time);

      audio.forEach(a => a.play());
    },
    [audio, config, max]
  );

  const win = getCurrent();

  const minimize = () => win.minimize();

  const close = async () => {
    await win.emit(FrontendEvent.CancelCopy);
    win.close();
  };

  return (
    <div className={cn("w-screen h-screen")}>
      <div
        data-tauri-drag-region
        className={cn(
          "w-full h-6",
          "flex justify-end",
          "fixed top-0 left-0 right-0",
          "border-b border-b-[--gray-6]"
        )}
      >
        <TopbarButton
          id="copy-page-topbar-button-minimize"
          icon={<MinusIcon />}
          onClick={minimize}
        />

        <TopbarButton
          id="copy-page-topbar-button-close"
          icon={<Cross1Icon />}
          onClick={close}
          danger
        />
      </div>
      <div
        className={cn(
          "w-full h-[calc(100vh-1.5rem)]",
          "fixed top-6 left-0 right-0 bottom-0",
          "flex flex-col items-center justify-center gap-4"
        )}
      >
        {value === 0 || max === 0 ? (
          <div className={cn("flex gap-4")}>
            <Spinner />
            <p>Starting...</p>
          </div>
        ) : (
          <>
            <Progress
              className={cn("w-5/6 h-10", "rounded-none")}
              indicatorClassName={cn("rounded-none")}
              max={max}
              value={value}
            />
            <div
              className={cn(
                "w-1/2",
                "flex flex-col items-center gap-1",
                "whitespace-nowrap"
              )}
            >
              {toDisplay.split("\n").map((item, index) => (
                <p key={index}>{item}</p>
              ))}

              {time !== -1 && <p>{time.toFixed(1)} seconds</p>}
            </div>
          </>
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
