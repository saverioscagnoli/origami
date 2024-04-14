import { CurrentDirContext } from "@contexts/current-dir";
import { createContextHook } from "@lib/utils";

const useCurrentDir = createContextHook(CurrentDirContext, "CurrentDir");

export { useCurrentDir };
