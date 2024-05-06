import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Theme } from "@typings/settings";

const ThemeMenuItem = () => {
  const { theme, updateSettings } = useSettings();

  const onValueChange = (value: string) => {
    updateSettings({ theme: value as Theme });
  };

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MagicWandIcon />}>Theme</Menubar.SubTrigger>
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
