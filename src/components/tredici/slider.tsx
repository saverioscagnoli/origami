import { cn } from "@lib/utils";
import * as RxSlider from "@radix-ui/react-slider";
import { cva } from "class-variance-authority";
import { RefAttributes, forwardRef } from "react";

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

type SliderColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w";

const sliderRangeVariants = cva(["h-full", "absolute", "rounded-full"], {
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
});

type SliderProps = RxSlider.SliderProps & {
  colorScheme?: SliderColorScheme;
};

const Slider = forwardRef<
  HTMLSpanElement,
  SliderProps & RefAttributes<HTMLSpanElement>
>(({ className, colorScheme = "plum", ...props }, ref) => {
  return (
    <RxSlider.Root
      className={cn(
        "w-[12.5rem] h-1.5",
        "relative flex items-center",
        "select-none touch-none",
        className
      )}
      {...props}
      ref={ref}
    >
      <RxSlider.Track
        className={cn("h-full", "relative flex-1", "rounded-full", "bg-[--gray-5]")}
      >
        <RxSlider.Range
          className={sliderRangeVariants({ className, colorScheme })}
        />
      </RxSlider.Track>
      <RxSlider.Thumb
        className={cn("w-4 h-4", "rounded-full", "block", "shadow", "outline-none", [
          "bg-[--slate-1]",
          "dark:bg-[--slate-12]",
          "border border-[--slate-12]",
          "dark:border-none"
        ])}
      />
    </RxSlider.Root>
  );
});

export { Slider };
export type { SliderColorScheme, SliderProps };
