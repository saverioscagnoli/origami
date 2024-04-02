import { FlagsContext } from "@contexts/flags";
import { createContextHook } from "@utils";

const useFlags = createContextHook(FlagsContext, "Flags");

export { useFlags };
