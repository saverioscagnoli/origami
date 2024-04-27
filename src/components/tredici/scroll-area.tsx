import * as RxScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";
import { ForwardRefExoticComponent, RefAttributes, forwardRef } from "react";

import "@radix-ui/colors/plum.css";
import "@radix-ui/colors/plum-dark.css";

import "@radix-ui/colors/teal.css";
import "@radix-ui/colors/teal-dark.css";

import "@radix-ui/colors/grass.css";
import "@radix-ui/colors/grass-dark.css";

import "@radix-ui/colors/red.css";
import "@radix-ui/colors/red-dark.css";

import "@radix-ui/colors/amber.css";
import "@radix-ui/colors/amber-dark.css";

import "@radix-ui/colors/blue.css";
import "@radix-ui/colors/blue-dark.css";

import "@radix-ui/colors/gray.css";
import "@radix-ui/colors/gray-dark.css";

import "@radix-ui/colors/slate.css";
import "@radix-ui/colors/slate-dark.css";

type ScrollAreaScrollbarColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w"
  | "gray";

type ScrollAreaComponent = ForwardRefExoticComponent<
  ScrollAreaProps & RefAttributes<HTMLDivElement>
> & {
  Viewport: typeof RxScrollArea.Viewport;
  Scrollbar: typeof ScrollAreaScrollbar;
  Corner: typeof ScrollAreaCorner;
};

type ScrollAreaProps = RxScrollArea.ScrollAreaProps;

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <RxScrollArea.Root
        className={cn("overflow-hidden", className)}
        {...props}
        ref={ref}
      >
        {children}
      </RxScrollArea.Root>
    );
  }
) as ScrollAreaComponent;

type ScrollAreaViewportProps = RxScrollArea.ScrollAreaViewportProps;

ScrollArea.Viewport = RxScrollArea.Viewport;

const scrollAreaThumbVariants = cva(
  [
    "flex-1",
    "rounded-xl",
    "relative",
    [
      "before:w-full after:h-full",
      "before:min-w-[44px] after:min-h-[44px]",
      "before:content-['']",
      "before:absolute",
      "before:top-1/2",
      "before:left-1/2",
      "before:-translate-x-1/2",
      "before:-translate-y-1/2"
    ]
  ],
  {
    variants: {
      colorScheme: {
        plum: ["bg-[--plum-9]", "hover:bg-[--plum-11]"],
        teal: ["bg-[--teal-9]", "hover:bg-[--teal-11]"],
        grass: ["bg-[--grass-9]", "hover:bg-[--grass-11]"],
        red: ["bg-[--red-9]", "hover:bg-[--red-11]"],
        amber: ["bg-[--amber-9]", "hover:bg-[--amber-11]"],
        blue: ["bg-[--blue-9]", "hover:bg-[--blue-11]"],
        "b/w": ["bg-[--slate-12]"],
        gray: ["bg-[--gray-7]", "hover:bg-[--gray-9]"]
      }
    },
    defaultVariants: {
      colorScheme: "plum"
    }
  }
);

type ScrollAreaScrollbarProps = RxScrollArea.ScrollAreaScrollbarProps & {
  colorScheme?: ScrollAreaScrollbarColorScheme;
};

const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  ({ className, colorScheme = "plum", ...props }, ref) => {
    return (
      <RxScrollArea.Scrollbar
        className={cn(
          "flex",
          "select-none",
          "touch-none",
          "p-[3px]",
          "bg-transparent",
          [
            "data-[orientation='vertical']:w-3",
            "data-[orientation='horizontal']:flex-col",
            "data-[orientation='horizontal']:h-3"
          ],
          className
        )}
        {...props}
        ref={ref}
      >
        <RxScrollArea.Thumb className={scrollAreaThumbVariants({ colorScheme })} />
      </RxScrollArea.Scrollbar>
    );
  }
);

type ScrollAreaCornerProps = RxScrollArea.ScrollAreaCornerProps;

const ScrollAreaCorner = RxScrollArea.Corner;

ScrollArea.Scrollbar = ScrollAreaScrollbar;
ScrollArea.Corner = ScrollAreaCorner;

ScrollArea.displayName = RxScrollArea.Root.displayName;

export { ScrollArea };
export type {
  ScrollAreaScrollbarColorScheme,
  ScrollAreaProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaCornerProps
};