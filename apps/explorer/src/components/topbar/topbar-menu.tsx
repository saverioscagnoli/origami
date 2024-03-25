import { useDirectory } from "@hooks/use-directory";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeOpenIcon,
  FilePlusIcon,
  PlusIcon
} from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const TopbarMenu = () => {
  const { history, historyIndex, showHidden, goBack, goForward } =
    useDirectory();

  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content sideOffset={10}>
          <Menubar.Item leftIcon={<FilePlusIcon />}>New File...</Menubar.Item>
          <Menubar.Item leftIcon={<PlusIcon />}>New Folder...</Menubar.Item>

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
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
