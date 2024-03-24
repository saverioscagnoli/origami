import { ThemeContext } from "@contexts/theme";
import { useContext } from "react";

const useTheme = () => {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
};

export { useTheme };
