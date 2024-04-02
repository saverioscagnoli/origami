import { DisksContext } from "@contexts/disks";
import { createContextHook } from "@utils";

const useDisks = createContextHook(DisksContext, "Disks");

export { useDisks };
