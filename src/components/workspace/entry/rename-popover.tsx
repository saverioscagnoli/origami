import { Input, Popover } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";
import { ChildrenProps } from "@typings/props";
import {
  FC,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type RenamePopoverProps = ChildrenProps & {
  name: string;
};

const RenamePopover: FC<RenamePopoverProps> = ({ children, name }) => {
  const { renaming, setRenaming } = useGlobalStates();
  const { renameEntry } = useCommands();
  const { replaceSelected } = useCurrentDir();

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>(name);

  const open = useMemo(() => renaming?.name === name, [renaming]);

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
      case "Enter": {
        renameEntry(value);
        replaceSelected([]);
        break;
      }

      case "Escape": {
        setRenaming(null);
        replaceSelected([]);
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
            value={value}
            onValueChange={setValue}
            spellCheck={false}
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
