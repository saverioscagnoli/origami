import React, { Dispatch, SetStateAction, useState } from "react";
import { For } from "~/components/for";
import { Popover } from "~/components/tredici";
import { useWailsEvent } from "~/hooks/use-wails-events";
import { cn } from "~/lib/utils";
import { Notification } from "./notification";

type NotificationsPopoverProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
};

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  open,
  setOpen,
  children
}) => {
  const [notifications, setNotifications] = useState<
    { id: string; el: React.ReactNode }[]
  >([]);

  useWailsEvent("f:notification", ([id, name, dst]) => {
    setOpen(true);

    setNotifications(notifications => [
      ...notifications,
      { id, el: <Notification key={id} id={id} name={name} dst={dst} /> }
    ]);
  });

  useWailsEvent("f:notification-close", id => {
    setNotifications(notifications => notifications.filter(n => n.id !== id));
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content
        className={cn(
          "w-96 h-fit",
          "mr-2",
          "cursor-default select-none",
          "border-[--gray-6]"
        )}
        sideOffset={10}
        onOpenAutoFocus={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
      >
        <For
          fallback={
            <div
              className={cn(
                "w-96 h-12",
                "flex items-center justify-center",
                "p2"
              )}
            >
              <p className={cn("text-[--gray-9]")}>No notifications!</p>
            </div>
          }
          of={notifications}
        >
          {n => n.el}
        </For>
      </Popover.Content>
    </Popover>
  );
};

export { NotificationsPopover };
