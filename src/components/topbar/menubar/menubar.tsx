import { Menubar } from "@components/tredici";
import { TopbarFileMenu } from "./file";
import { TopbarEditMenu } from "./edit";
import { TopbarViewMenu } from "./view";
import { TopbarGoMenu } from "./go";

const TopbarMenu = () => {
  return (
    <Menubar>
      <TopbarFileMenu />
      <TopbarEditMenu />
      <TopbarViewMenu />
      <TopbarGoMenu />
    </Menubar>
  );
};

export { TopbarMenu };
