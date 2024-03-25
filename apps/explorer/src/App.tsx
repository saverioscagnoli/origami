import { cn } from "@utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { Viewport } from "@components/viewport";
import { Bottombar } from "@components/bottombar";
import { DisksProvider } from "@providers/disks";

function App() {
  return (
    <>
      <Topbar />
      <div className={cn("w-screen h-[calc(100vh-2rem)]", "mt-8", "flex")}>
        <DisksProvider>
          <Sidebar />
        </DisksProvider>
        <Viewport />
        <Bottombar />
      </div>
    </>
  );
}

export { App };
