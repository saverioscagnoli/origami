import { ThemeContext } from "@contexts/theme";
import { createContextHook } from "@utils";

const useTheme = createContextHook(ThemeContext, "Theme");

export { useTheme };
