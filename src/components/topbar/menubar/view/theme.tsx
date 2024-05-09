import { Menubar } from "@components/tredici";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Theme, useSettings } from "@zustand/settings-store";

const ThemeMenuItem = () => {
  const [theme, updateSettings] = useSettings(state => [
    state.theme,
    state.updateSettings
  ]);

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
