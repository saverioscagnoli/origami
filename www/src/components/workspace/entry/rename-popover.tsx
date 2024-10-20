import { RenameEntry } from "@wails/methods/fs/Filesystem";
import React, {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Input, Popover } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

type RenamePopoverProps = {
  name: string;
  children: React.ReactNode;
};

const RenamePopover: React.FC<RenamePopoverProps> = ({ children, name }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(name);

  const [renaming, setRenaming] = useStates(s => [s.renaming, s.setRenaming]);
  const [selected, setSelected] = useCurrentDir(s => [
    s.selected,
    s.setSelected
  ]);

  const open = useMemo(() => renaming?.Name === name, [renaming]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(0, name.lastIndexOf("."));
      });
    }
  }, [open]);

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setRenaming(null);
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    switch (e.key) {
      // @ts-ignore
      case "Enter": {
        const oldPath = selected[0].Path;
        RenameEntry(oldPath, value);
      }
      case "Escape": {
        setRenaming(null);
        setSelected([]);
        break;
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content onCloseAutoFocus={e => e.preventDefault()}>
        <div className={cn("w-full flex items-center gap-2")}>
          <Input
            size="sm"
            spellCheck={false}
            autoComplete="off"
            value={value}
            onValueChange={setValue}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
          <Popover.Close className={cn("static")} />
        </div>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>
  );
};

export { RenamePopover };
