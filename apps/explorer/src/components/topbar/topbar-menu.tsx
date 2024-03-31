import { useDirectory } from "@hooks/use-directory";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeOpenIcon,
  FilePlusIcon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { Menubar } from "@tredici";
import { BsFolderFill } from "react-icons/bs";

const TopbarMenu = () => {
  const {
    history,
    historyIndex,
    showHidden,
    searching,
    createFile,
    createDir,
    goBack,
    goForward
  } = useDirectory();

  const search = () => searching.set(true);

  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content sideOffset={7}>
          <Menubar.Item leftIcon={<FilePlusIcon />} onClick={createFile}>
            New File
          </Menubar.Item>
          <Menubar.Item leftIcon={<BsFolderFill />} onClick={createDir}>
            New Folder
          </Menubar.Item>

          <Menubar.Separator />
          <Menubar.Item
            disabled={historyIndex.get() === 0}
            leftIcon={<ArrowLeftIcon />}
            onClick={goBack}
          >
            Back
          </Menubar.Item>
          <Menubar.Item
            disabled={historyIndex.get() === history.get().length - 1}
            leftIcon={<ArrowRightIcon />}
            onClick={goForward}
          >
            Forward
          </Menubar.Item>

          <Menubar.Separator />

          <Menubar.CheckboxItem
            leftIcon={<EyeOpenIcon />}
            checked={showHidden.get()}
            onCheckedChange={showHidden.set}
          >
            Show Hidden Files
          </Menubar.CheckboxItem>

          <Menubar.Separator />

          <Menubar.Item leftIcon={<MagnifyingGlassIcon />} onClick={search}>
            Find in folder
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
