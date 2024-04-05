import { whenChanges } from "@life-cycle";
import { useRef } from "react";

const useClickOutside = <T extends Element>(cb: (e: MouseEvent) => void) => {
  const ref = useRef<T>(null);

  whenChanges([ref], () => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        cb(e);
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
