import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface Settings {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const useSettings = create<Settings>()(set => ({
  theme: "system",
  setTheme: theme => set({ theme })
}));

export { useSettings };
