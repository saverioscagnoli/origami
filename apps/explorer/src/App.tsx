import { cn } from "@utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { Viewport } from "@components/viewport";
import { Bottombar } from "@components/bottombar";
import { DisksProvider } from "@providers/disks";
import { useDirectory } from "@hooks/use-directory";
import { useEffect, useRef } from "react";

function App() {
  const { searching, searchTerm } = useDirectory();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        /^[a-z0-9]+$/i.test(e.key) &&
        e.key.length === 1 &&
        !searching.get()
      ) {
        searching.set(true);
      }

      if (e.key === "Escape") {
        searchTerm.set("");
      }
    };

    wrapperRef.current?.addEventListener("keydown", onKeyDown);
    return () => {
      wrapperRef.current?.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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
        ref={wrapperRef}
        tabIndex={0}
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
