import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useNavigation } from "@hooks/use-navigation";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api";
import { ContextMenu } from "@tredici";
import { useMemo } from "react";

const Paste = () => {
  const { dir } = useCurrentDir();
  const { clipboardEntries } = useGlobalStates();
  const { reload } = useNavigation();

  const disabled = useMemo(
    () => clipboardEntries.get() === null,
    [clipboardEntries.get()]
  );

  const onPaste = async () => {
    clipboardEntries.set(null);
    let [entries, cutting] = clipboardEntries.get();

    for (let entry of entries) {
      await invoke("paste", { source: entry.path, targetDir: dir.get(), cutting });
    }

    reload();
  };

  return (
    <ContextMenu.Item
      leftIcon={<ClipboardIcon />}
      disabled={disabled}
      onClick={onPaste}
    >
      Paste
    </ContextMenu.Item>
  );
};

export { Paste };
