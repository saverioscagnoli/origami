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
      <div
        className={cn(
          "w-screen h-[calc(100vh-3.5rem)]",
          "mt-8",
          "flex",
          "select-none"
        )}
      >
        <DisksProvider>
          <Sidebar />
        </DisksProvider>
        <Viewport />
      </div>
      <Bottombar />
    </>
  );
}

export { App };
