import { Input, Popover } from "@components/tredici";
import { cn } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { ChildrenProps } from "@typings/props";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(name);

  const [renaming, setRenaming] = useGlobalStates(s => [s.renaming, s.setRenaming]);
  const [selected, replaceSelected] = useCurrentDir(state => [
    state.selected,
    state.replaceSelected
  ]);

  const push = useCallstack(state => state.push);

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
      // @ts-ignore
      case "Enter": {
        const oldPath = selected.at(0)!.path;
        push(CommandName.RenameEntry, { oldPath, newName: value });
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
