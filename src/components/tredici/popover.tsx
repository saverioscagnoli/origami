import { cn } from "@lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import * as RxPopover from "@radix-ui/react-popover";
import { forwardRef } from "react";

import "@radix-ui/colors/gray.css";

import "@radix-ui/colors/slate-dark.css";
import "@radix-ui/colors/slate.css";

import "./popover.css";

type PopoverComponent = React.FC<RxPopover.PopoverProps> & {
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
  Anchor: typeof PopoverAnchor;
  Arrow: typeof PopoverArrow;
};

type PopoverProps = RxPopover.PopoverProps;

const Popover = RxPopover.Popover as PopoverComponent;

type PopoverTriggerProps = RxPopover.PopoverTriggerProps;

const PopoverTrigger = RxPopover.PopoverTrigger;

type PopoverContentProps = RxPopover.PopoverContentProps;

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => {
    return (
      <RxPopover.Portal>
        <RxPopover.Content
          sideOffset={sideOffset}
          className={cn(
            "h-fit",
            "p-2",
            "border border-[--gray-7]",
            "shadow-lg rounded",
            ["bg-[--slate-1]", "text-[--slate-12]"],
            "popover-content",
            className
          )}
          {...props}
          ref={ref}
        />
      </RxPopover.Portal>
    );
  }
);

type PopoverCloseProps = RxPopover.PopoverCloseProps;

const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) {
      return (
        <RxPopover.Close
          className={cn("absolute top-2 right-2", "p-1", className)}
          {...props}
          ref={ref}
        >
          <Cross1Icon
            className={cn(["text-[--gray-10]", "hover:text-[--gray-12]"])}
          />
        </RxPopover.Close>
      );
    } else {
      return (
        <RxPopover.Close
          children={children}
          className={className}
          {...props}
          ref={ref}
        />
      );
    }
  }
);

type PopoverAnchorProps = RxPopover.PopoverAnchorProps;

const PopoverAnchor = RxPopover.PopoverAnchor;

type PopoverArrowProps = RxPopover.PopoverArrowProps;

const PopoverArrow = forwardRef<SVGSVGElement, PopoverArrowProps>(
  ({ width = 7, height = 4, className, ...props }, ref) => {
    return (
      <RxPopover.Arrow
        width={width}
        height={height}
        className={cn("fill-[--gray-7]", className)}
        {...props}
        ref={ref}
      />
    );
  }
);

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;
Popover.Anchor = PopoverAnchor;
Popover.Arrow = PopoverArrow;

Popover.displayName = RxPopover.Root.displayName;

export { Popover };
export type {
  PopoverAnchorProps,
  PopoverArrowProps,
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps
};
