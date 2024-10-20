import { Menubar } from "~/components/tredici";
import { TopbarEditMenu } from "./edit";
import { TopbarFileMenu } from "./file";
import { TopbarGoMenu } from "./go";
import { TopbarViewMenu } from "./view";

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
