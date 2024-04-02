import { whenChanges } from "@life-cycle";
import { useRef } from "react";

const useClickOutside = <T extends Element>(cb: () => void) => {
  const ref = useRef<T>(null);

  whenChanges([ref], () => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return ref;
};

export { useClickOutside };
