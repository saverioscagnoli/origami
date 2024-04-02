import { useTheme } from "@hooks/use-theme";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const Theme = () => {
  const { theme, setTheme } = useTheme();

  const light = () => setTheme("light");
  const dark = () => setTheme("dark");
  const system = () => setTheme("system");

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MagicWandIcon />}>Theme</Menubar.SubTrigger>
      <Menubar.SubContent defaultValue={theme}>
        <Menubar.RadioGroup value={theme}>
          <Menubar.RadioItem value="light" onClick={light}>
            Light
          </Menubar.RadioItem>
          <Menubar.RadioItem value="dark" onClick={dark}>
            Dark
          </Menubar.RadioItem>
          <Menubar.RadioItem value="system" onClick={system}>
            System
          </Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.SubContent>
    </Menubar.Sub>
  );
};

export { Theme };
