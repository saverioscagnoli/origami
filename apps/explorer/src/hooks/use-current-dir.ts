import { CurrentDirContext } from "@contexts/current-dir";
import { createContextHook } from "@utils";

const useCurrentDir = createContextHook(CurrentDirContext, "CurrentDir");

export { useCurrentDir };
