import { MagicWandIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useSettings } from "~/zustand/settings";

const ThemeMenuItem = () => {
  const [theme, setTheme] = useSettings(s => [s.theme, s.setTheme]);

  const onValueChange = (v: string) => {
    setTheme(v as "light" | "dark" | "system");
  };

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MagicWandIcon />}>
        Theme
      </Menubar.SubTrigger>
      <Menubar.SubContent>
        <Menubar.RadioGroup value={theme} onValueChange={onValueChange}>
          <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
          <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
          <Menubar.RadioItem value="system">System</Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.SubContent>
    </Menubar.Sub>
  );
};

export { ThemeMenuItem };
