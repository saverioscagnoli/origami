import { TopbarButtonGroup } from "./button-group";
import { TopbarDirDisplay } from "./dir-display";
import "./topbar.css";

const Topbar = () => {
  return (
    <div id="topbar">
      <div>menu</div>
      <TopbarDirDisplay />
      <TopbarButtonGroup />
    </div>
  );
};

export { Topbar };
