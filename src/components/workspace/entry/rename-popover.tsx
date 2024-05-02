import { Input, Popover } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { useDispatchers } from "@hooks/use-dispatchers";
import { cn } from "@lib/utils";
import { ChildrenProps } from "@typings/props";
import { FC, KeyboardEventHandler, useEffect, useMemo, useRef } from "react";

type RenamePopoverProps = ChildrenProps & {
  name: string;
};

const RenamePopover: FC<RenamePopoverProps> = ({ children, name }) => {
  const value = useAccessor<string>(name);
  const { renaming } = useGlobalStates();
  const inputRef = useRef<HTMLInputElement>(null);

  const open = useMemo(() => renaming()?.name === name, [renaming(), name]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      renaming.set(null);
    }
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setTimeout(() => {
        inputRef.current?.setSelectionRange(0, name.lastIndexOf("."));
      });
    }
  }, [open]);

  const { renameEntry } = useDispatchers();

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Escape") {
      renaming.set(null);
    }

    if (e.key === "Enter") {
      const oldPath = renaming().path;
      renameEntry(oldPath, value());
      renaming.set(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content onCloseAutoFocus={e => e.preventDefault()}>
        <div className={cn("w-full flex items-center gap-2")}>
          <Input
            size="sm"
            value={value()}
            onValueChange={value.set}
            onKeyDown={onKeyDown}
            spellCheck={false}
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
