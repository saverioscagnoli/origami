import { Menubar } from "@components/tredici";
import { useSettings } from "@contexts/settings";
import { MagicWandIcon } from "@radix-ui/react-icons";

const ThemeMenuItem = () => {
  const { theme } = useSettings();

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MagicWandIcon />}>
        Theme
      </Menubar.SubTrigger>
      <Menubar.SubContent>
        {/* @ts-ignore */}
        <Menubar.RadioGroup value={theme()} onValueChange={theme.set}>
          <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
          <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
          <Menubar.RadioItem value="system">System</Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.SubContent>
    </Menubar.Sub>
  );
};

export { ThemeMenuItem };
