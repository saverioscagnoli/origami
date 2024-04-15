import { SettingsContext } from "@contexts/settings";
import { createContextHook } from "@lib/utils";

const useSettings = createContextHook(SettingsContext, "Settings");

export { useSettings };
