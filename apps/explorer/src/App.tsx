import { cn } from "@utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { Viewport } from "@components/viewport";
import { Bottombar } from "@components/bottombar";

function App() {
  return (
    <>
      <Topbar />
      <div className={cn("w-screen h-[calc(100vh-2rem)]", "mt-8", "flex")}>
        <Sidebar />
        <Viewport />
        <Bottombar />
      </div>
    </>
  );
}

export { App };
