import { Button, Dialog } from "@components/tredici";
import { cn } from "@lib/utils";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useConfig } from "@zustand/config-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useEffect, useMemo, useState } from "react";

const ErrorDialog = () => {
  const [error, setError] = useGlobalStates(s => [s.error, s.setError]);
  const [audio, setAudio] = useState<HTMLAudioElement[]>([]);
  const config = useConfig(state => state.config);

  /**
   * Load and prepare audio files for notifications.
   */
  useEffect(() => {
    const audioPaths = config?.notifications?.error?.paths;
    const audios = audioPaths?.map(path => new Audio(convertFileSrc(path)));

    setAudio(audios);
  }, [config]);

  const open = useMemo(() => error !== null, [error]);

  /**
   * Play audio when the dialog is opened.
   */
  useEffect(() => {
    if (open) {
      audio.forEach(a => a.play());
    }
  }, [open]);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Error!</Dialog.Title>
        <Dialog.Description>{error}</Dialog.Description>
        <div className={cn("flex justify-end")}>
          <Dialog.Close>
            <Button>Ok</Button>
          </Dialog.Close>
        </div>

        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { ErrorDialog };
