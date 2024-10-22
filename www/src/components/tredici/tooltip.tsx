import * as RxTooltip from "@radix-ui/react-tooltip";
import React, { forwardRef } from "react";
import { cn } from "~/lib/utils";

import "@radix-ui/colors/slate-dark.css";
import "@radix-ui/colors/slate.css";

import "./tooltip.css";

type TooltipComponent = React.FC<TooltipProps> & {
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow: typeof TooltipArrow;
};

type TooltipProps = RxTooltip.TooltipProps;

const Tooltip: TooltipComponent = props => {
  return (
    <RxTooltip.Provider {...props}>
      <RxTooltip.Root {...props} />
    </RxTooltip.Provider>
  );
};

type TooltipTriggerProps = RxTooltip.TooltipTriggerProps;

const TooltipTrigger = RxTooltip.Trigger;

type TooltipContentProps = RxTooltip.TooltipContentProps;

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => {
    return (
      <RxTooltip.Content
        className={cn(
          "bg-[--slate-12]",
          "text-[--slate-1]",
          "text-sm",
          "py-1",
          "px-2",
          "font-semibold",
          "rounded-md",
          "shadow",
          "z-50",
          "tooltip-content",
          className
        )}
        sideOffset={sideOffset}
        {...props}
        ref={ref}
      />
    );
  }
);

type TooltipArrowProps = RxTooltip.TooltipArrowProps;

const TooltipArrow = forwardRef<SVGSVGElement, TooltipArrowProps>(
  ({ width = 7, height = 3, className, ...props }, ref) => {
    return (
      <RxTooltip.Arrow
        width={width}
        height={height}
        className={cn("fill-[--slate-12]", className)}
        {...props}
        ref={ref}
      />
    );
  }
);
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;

Tooltip.displayName = RxTooltip.Root.displayName;

export { Tooltip };
export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
  TooltipTriggerProps
};
