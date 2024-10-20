import { For } from "~/components/for";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";

const KnownFoldersMenuItems = () => {
  const cd = useCurrentDir(s => s.cd);
  const knownFolders = useEnv(s => s.knownFolders);

  return (
    <For of={knownFolders}>
      {({ path, name, icon }) => (
        <Menubar.Item key={path} leftIcon={icon} onSelect={() => cd(path)}>
          {name}
        </Menubar.Item>
      )}
    </For>
  );
};

export { KnownFoldersMenuItems };
