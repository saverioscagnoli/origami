import { Menubar } from "@components/tredici";

const TopbarEditMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Edit</Menubar.Trigger>
      <Menubar.Content
        onCloseAutoFocus={e => e.preventDefault()}
      ></Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarEditMenu };
