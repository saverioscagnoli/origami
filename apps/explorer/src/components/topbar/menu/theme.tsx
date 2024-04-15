import { Menubar } from "@components/tredici";
import { useSettings } from "@hooks/use-settings";
import { MagicWandIcon } from "@radix-ui/react-icons";

const ThemeMenuItem = () => {
  const { theme } = useSettings();

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MagicWandIcon />}>Theme</Menubar.SubTrigger>
      <Menubar.SubContent>
        <Menubar.RadioGroup
          value={theme()}
          onValueChange={theme.set as (v: string) => void}
        >
          <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
          <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
          <Menubar.RadioItem value="system">System</Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.SubContent>
    </Menubar.Sub>
  );
};

export { ThemeMenuItem };
