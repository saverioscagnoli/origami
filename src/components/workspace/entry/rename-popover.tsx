import { Input, Popover } from "@components/tredici";
import { cn } from "@lib/utils";
import { ChildrenProps } from "@typings/props";
import { FC } from "react";

type RenamePopoverProps = ChildrenProps & {
  name: string;
};

const RenamePopover: FC<RenamePopoverProps> = ({ children, name }) => {
  return (
    <Popover>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content onCloseAutoFocus={e => e.preventDefault()}>
        <div className={cn("w-full flex items-center gap-2")}>
          <Input size="sm" spellCheck={false} />
          <Popover.Close className={cn("static")} />
        </div>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>
  );
};

export { RenamePopover };
