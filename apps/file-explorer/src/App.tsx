import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { cn } from "@utils";

function App() {
  return (
    <div>
      <Topbar />
      <div className={cn("w-screen h-[calc(100vh-2rem)]", "mt-8")}>
        <Sidebar />
      </div>
    </div>
  );
}

export { App };
