import { cn } from "@lib/utils";
import { Topbar } from "@components/topbar";
import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { setupFrontendEvents, setupTauriEvents } from "@lib/setup-events";
import { setupFunctions } from "@lib/setup-functions";
import { Workspace } from "@components/workspace";

function App() {
  setupFrontendEvents();
  setupTauriEvents();

  setupFunctions();

  console.log("App render");

  return (
    <div className={cn("w-screen h-screen", "select-none")}>
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex gap-0")}
      >
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export default App;
