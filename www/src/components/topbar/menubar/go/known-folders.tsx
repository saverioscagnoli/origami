import React from "react";
import { For } from "~/components/for";
import { Menubar } from "~/components/tredici";
import { useDir } from "~/stores/dir";
import { useEnv } from "~/stores/env";

const KnownFoldersItems: React.FC = () => {
  const cd = useDir(s => s.cd);
  const knownFolders = useEnv(s => s.knownFolders);

  const onSelect = (path: string) => () => cd(path);

  return (
    <For of={knownFolders}>
      {({ path, name, icon }) => (
        <Menubar.Item key={path} leftIcon={icon} onSelect={onSelect(path)}>
          {name}
        </Menubar.Item>
      )}
    </For>
  );
};

export { KnownFoldersItems };
