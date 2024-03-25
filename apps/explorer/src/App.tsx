import { cn } from "@utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { DirectoryProvider } from "@providers/directory";
import { Viewport } from "@components/viewport";
import { Bottombar } from "@components/bottombar";

function App() {
  return (
    <DirectoryProvider>
      <Topbar />
      <div className={cn("w-screen h-[calc(100vh-2rem)]", "mt-8", "flex")}>
        <Sidebar />
        <Viewport />
        <Bottombar />
      </div>
    </DirectoryProvider>
  );
}

export { App };
