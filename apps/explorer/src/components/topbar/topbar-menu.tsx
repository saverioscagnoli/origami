import { useDirectory } from "@hooks/use-directory";
import { ArrowLeftIcon, FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const TopbarMenu = () => {
  const { history, goBack } = useDirectory();

  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item leftIcon={<FilePlusIcon />}>New File...</Menubar.Item>
          <Menubar.Item leftIcon={<PlusIcon />}>New Folder...</Menubar.Item>

          <Menubar.Separator />

          <Menubar.Item
            disabled={history.get().length === 0}
            leftIcon={<ArrowLeftIcon />}
            onClick={goBack}
          >
            Back
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
