import { MagicWandIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { Theme, useConfig } from "~/stores/config";

const ThemeItem: React.FC = () => {
  const [theme, setConfig] = useConfig(s => [s.theme, s.set]);

  const onValueChange = (value: string) => {
    setConfig({ theme: value as Theme });
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

export { ThemeItem };
