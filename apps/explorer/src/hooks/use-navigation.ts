import { NavigationContext } from "@contexts/navigation";
import { createContextHook } from "@lib/utils";

const useNavigation = createContextHook(NavigationContext, "Navigation");

export { useNavigation };
