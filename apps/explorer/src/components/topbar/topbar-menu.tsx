import { useDirectory } from "@hooks/use-directory";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FilePlusIcon,
  PlusIcon
} from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const TopbarMenu = () => {
  const { history, historyIndex, goBack, goForward } = useDirectory();

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
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
