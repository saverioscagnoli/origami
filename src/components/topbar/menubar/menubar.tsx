import { Menubar } from "@components/tredici";
import { TopbarFileMenu } from "./file";
import { TopbarEditMenu } from "./edit";
import { TopbarViewMenu } from "./view";

const TopbarMenu = () => {
  return (
    <Menubar>
      <TopbarFileMenu />
      <TopbarEditMenu />
      <TopbarViewMenu />
    </Menubar>
  );
};

export { TopbarMenu };
