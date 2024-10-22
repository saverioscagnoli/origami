import { BellIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Tooltip } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { NotificationsPopover } from "./popover";

const NotificationsButton: React.FC = () => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const onOpenChange = (v: boolean) => {
    // Prevent the tooltip from opening if the popover is open
    if (popoverOpen) {
      setTooltipOpen(false);
      return;
    }

    // Only open the tooltip if popover is not open
    if (!popoverOpen && v) {
      setTooltipOpen(v);
    } else {
      setTooltipOpen(v);
    }
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={onOpenChange} delayDuration={0}>
      <NotificationsPopover open={popoverOpen} setOpen={setPopoverOpen}>
        <Tooltip.Trigger asChild>
          <button
            className={cn("h-full", "px-1.5", [
              "hover:bg-[--gray-3]",
              "active:bg-[--gray-4]"
            ])}
          >
            <BellIcon />
          </button>
        </Tooltip.Trigger>
      </NotificationsPopover>
      <Tooltip.Content>
        Notifications
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip>
  );
};

export { NotificationsButton };
