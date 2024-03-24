import { DirectoryProvider } from "@components/directory-provider";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Viewport } from "@components/viewport";
import { cn } from "@utils";

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
