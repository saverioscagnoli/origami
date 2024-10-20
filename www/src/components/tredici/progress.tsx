import { cn } from "~/lib/utils";
import * as RxProgress from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

import "@radix-ui/colors/plum-dark.css";
import "@radix-ui/colors/plum.css";

import "@radix-ui/colors/teal-dark.css";
import "@radix-ui/colors/teal.css";

import "@radix-ui/colors/grass-dark.css";
import "@radix-ui/colors/grass.css";

import "@radix-ui/colors/red-dark.css";
import "@radix-ui/colors/red.css";

import "@radix-ui/colors/amber-dark.css";
import "@radix-ui/colors/amber.css";

import "@radix-ui/colors/blue-dark.css";
import "@radix-ui/colors/blue.css";

import "@radix-ui/colors/gray-dark.css";
import "@radix-ui/colors/gray.css";

import "@radix-ui/colors/slate-dark.css";
import "@radix-ui/colors/slate.css";

import "./progress.css";

type ProgressColorScheme = "plum" | "teal" | "grass" | "red" | "amber" | "b/w";

const progressIndicatorVariants = cva(
  ["w-full h-full", "rounded-full", "progress-indicator"],
  {
    variants: {
      colorScheme: {
        plum: "bg-[--plum-9]",
        teal: "bg-[--teal-9]",
        grass: "bg-[--grass-9]",
        red: "bg-[--red-9]",
        amber: "bg-[--amber-9]",
        blue: "bg-[--blue-9]",
        "b/w": "bg-[--slate-12]"
      }
    },
    defaultVariants: {
      colorScheme: "plum"
    }
  }
);

type ProgressProps = RxProgress.ProgressProps & {
  indefinite?: boolean;
  colorScheme?: ProgressColorScheme;
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
};

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      indicatorClassName,
      indicatorStyle,
      value,
      indefinite,
      colorScheme = "plum",
      max = 100,
      ...props
    },
    ref
  ) => {
    value = value ?? 0;

    return (
      <RxProgress.Root
        className={cn(
          "w-[12.5rem] h-1.5",
          "relative",
          "bg-[--gray-5]",
          "overflow-hidden",
          "rounded-full",
          "progress",
          className
        )}
        value={value}
        max={max}
        {...props}
        ref={ref}
      >
        <RxProgress.Indicator
          className={progressIndicatorVariants({
            className: cn(indefinite && "indefinite", indicatorClassName),
            colorScheme
          })}
          style={{
            transform: `translateX(-${100 - (value / max) * 100}%`,
            ...indicatorStyle
          }}
        />
      </RxProgress.Root>
    );
  }
);

export { Progress };
export type { ProgressColorScheme, ProgressProps };
