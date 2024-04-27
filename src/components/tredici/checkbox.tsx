import * as RxCheckbox from "@radix-ui/react-checkbox";
import { ReactNode, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { CheckIcon } from "@radix-ui/react-icons";

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

type CheckboxColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w"
  | "gray";

type CheckboxSize = "sm" | "md" | "lg";

const checkboxVariants = cva(
  [
    "bg-transparent",
    "inline-flex items-center justify-center",
    ["border-2", "data-[state='checked']:border-none", "border-[--gray-8]"],
    ["disabled:cursor-not-allowed", "disabled:opacity-50"]
  ],
  {
    variants: {
      colorScheme: {
        plum: "data-[state='checked']:bg-[--plum-9] text-[--slate-1]",
        teal: "data-[state='checked']:bg-[--teal-9] text-[--slate-1]",
        grass: "data-[state='checked']:bg-[--grass-9] text-[--slate-1]",
        red: [
          "data-[state='checked']:bg-[--red-9]",
          ["text-[--slate-1]", "dark:text-[--slate-12]"]
        ],
        amber: [
          "data-[state='checked']:bg-[--amber-9]",
          ["text-[--slate-12]", "dark:text-[--slate-1]"]
        ],
        blue: "data-[state='checked']:bg-[--blue-9] text-[--slate-1]",
        "b/w": [
          [
            "data-[state='checked']:bg-[--slate-12]",
            "data-[state='checked']:text-[--slate-1]"
          ]
        ],
        gray: ["data-[state='checked']:bg-[--gray-6]", "text-[--slate-12]"]
      },
      size: {
        sm: "w-3 h-3 rounded-sm text-sm",
        md: "w-[17px] h-[17px] rounded",
        lg: "w-[21px] h-[21px] rounded"
      }
    },
    defaultVariants: {
      colorScheme: "plum",
      size: "md"
    }
  }
);

const checkboxIconVariants = cva(null, {
  variants: {
    size: {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

type CheckboxProps = RxCheckbox.CheckboxProps & {
  colorScheme?: CheckboxColorScheme;
  size?: CheckboxSize;
  icon?: ReactNode;
};

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      colorScheme = "plum",
      size = "md",
      icon = <CheckIcon className={checkboxIconVariants({ size })} />,
      ...props
    },
    ref
  ) => {
    return (
      <RxCheckbox.Root
        className={checkboxVariants({ className, colorScheme, size })}
        {...props}
        ref={ref}
      >
        <RxCheckbox.Indicator children={icon} />
      </RxCheckbox.Root>
    );
  }
);

Checkbox.displayName = RxCheckbox.Root.displayName;

export { Checkbox };
export type { CheckboxProps, CheckboxColorScheme, CheckboxSize };
