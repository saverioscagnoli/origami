import { cn } from "@utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { DirectoryProvider } from "@providers/directory";
import { Viewport } from "@components/viewport";

function App() {
  return (
    <DirectoryProvider>
      <Topbar />
      <div className={cn("w-screen h-[calc(100vh-2rem)]", "mt-8", "flex")}>
        <Sidebar />
        <Viewport />
      </div>
    </DirectoryProvider>
  );
}

export { App };
