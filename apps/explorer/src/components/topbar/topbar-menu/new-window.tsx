import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api";
import { Menubar } from "@tredici";

const NewWindow = () => {
  const onNewWindow = async () => {
    await invoke("create_new_window");
  };

  return (
    <Menubar.Item leftIcon={<OpenInNewWindowIcon />} onClick={onNewWindow}>
      New Window
    </Menubar.Item>
  );
};

export { NewWindow };
