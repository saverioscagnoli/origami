import * as RxContextMenu from "@radix-ui/react-context-menu";
import React, { ReactNode, createContext, forwardRef, useContext } from "react";
import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons";

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

import "./context-menu.css";

type ContextMenuComponent = React.FC<ContextMenuProps> & {
  Trigger: typeof ContextMenuTrigger;
  Content: typeof ContextMenuContent;
  Label: typeof ContextMenuLabel;
  Item: typeof ContextMenuItem;
  CheckboxItem: typeof ContextMenuCheckboxItem;
  RadioGroup: typeof ContextMenuRadioGroup;
  RadioItem: typeof ContextMenuRadioItem;
  Sub: typeof ContextMenuSub;
  SubTrigger: typeof ContextMenuSubTrigger;
  SubContent: typeof ContextMenuSubContent;
  Separator: typeof ContextMenuSeparator;
};

type ContextMenuColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w"
  | "gray";

const ColorSchemeContext = createContext<ContextMenuColorScheme | null>(null);

const useColorScheme = () => {
  const ctx = useContext(ColorSchemeContext);

  if (!ctx) {
    throw new Error(
      "Context menu compund components must be used within a ContextMenu component"
    );
  }

  return ctx;
};

type ContextMenuProps = RxContextMenu.ContextMenuProps & {
  colorScheme?: ContextMenuColorScheme;
};

const ContextMenu: ContextMenuComponent = ({ colorScheme = "plum", ...props }) => {
  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <RxContextMenu.Root {...props} />
    </ColorSchemeContext.Provider>
  );
};

type ContextMenuTriggerProps = RxContextMenu.ContextMenuTriggerProps;

const ContextMenuTrigger = RxContextMenu.Trigger;

type ContextMenuContentProps = RxContextMenu.ContextMenuContentProps;

const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxContextMenu.Portal>
        <RxContextMenu.Content
          className={cn(
            "min-w-fit h-fit",
            "p-1",
            "border border-[--gray-7]",
            "rounded",
            "shadow-lg",
            "bg-[--slate-1]",
            "text-[--slate-12]",
            "context-menu-content",
            className
          )}
          {...props}
          ref={ref}
        />
      </RxContextMenu.Portal>
    );
  }
);

type ContextMenuLabelProps = RxContextMenu.ContextMenuLabelProps;

const ContextMenuLabel = forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxContextMenu.Label
        className={cn("pl-5 py-0.5 pb-1", "text-xs", className)}
        {...props}
        ref={ref}
      />
    );
  }
);

const contextMenuItemVariants = cva(["outline-none"], {
  variants: {
    colorScheme: {
      plum: ["focus:bg-[--plum-10]", "focus:text-[--slate-1]"],
      teal: ["focus:bg-[--teal-10]", "focus:text-[--slate-1]"],
      grass: ["focus:bg-[--grass-10]", "focus:text-[--slate-1]"],
      red: ["focus:bg-[--red-10]", "focus:text-[--slate-1]"],
      amber: [
        "focus:bg-[--amber-10]",
        ["focus:text-[--slate-12]", "dark:focus:text-[--slate-1]"]
      ],
      blue: ["focus:bg-[--blue-10]", "focus:text-[--slate-1]"],
      "b/w": ["focus:bg-[--slate-12]", "focus:text-[--slate-1]"],
      gray: ["focus:bg-[--gray-4]", "dark:focus:bg-[--gray-5]"]
    }
  }
});

type ContextMenuItemProps = RxContextMenu.ContextMenuItemProps & {
  colorScheme?: ContextMenuColorScheme;
  leftIcon?: ReactNode;
};

const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, children, colorScheme, leftIcon, ...props }, ref) => {
    return (
      <RxContextMenu.Item
        className={contextMenuItemVariants({
          className: cn(
            "flex items-center",
            "pr-3",
            "text-[14px]",
            "relative",
            "rounded-sm",
            "focus:cursor-default",
            ["data-[disabled]:opacity-30", "data-[disabled]:pointer-events-none"],
            className
          ),
          colorScheme: colorScheme ?? useColorScheme()
        })}
        {...props}
        ref={ref}
      >
        <div className="w-7 flex justify-center items-center">{leftIcon}</div>
        {children}
      </RxContextMenu.Item>
    );
  }
);

type ContextMenuCheckboxItemProps = RxContextMenu.ContextMenuCheckboxItemProps & {
  colorScheme?: ContextMenuColorScheme;
  leftIcon?: ReactNode;
  icon?: ReactNode;
};

const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(
  (
    {
      className,
      children,
      colorScheme,
      leftIcon,
      checked,
      icon = <CheckIcon />,
      ...props
    },
    ref
  ) => {
    return (
      <RxContextMenu.CheckboxItem
        className={contextMenuItemVariants({
          className: cn(
            "flex justify-between items-center",
            "text-[14px]",
            "relative",
            "rounded-sm",
            "focus:cursor-default",
            className
          ),
          colorScheme: colorScheme ?? useColorScheme()
        })}
        checked={checked}
        {...props}
        ref={ref}
      >
        <div className="w-7 flex justify-center items-center">{leftIcon}</div>
        {children}
        <div className="ml-auto pl-2 mr-3 w-[15px]">
          {!checked && <span className="w-[15px]" />}
          <RxContextMenu.ItemIndicator>{icon}</RxContextMenu.ItemIndicator>
        </div>
      </RxContextMenu.CheckboxItem>
    );
  }
);

type ContextMenuRadioGroupProps = RxContextMenu.ContextMenuRadioGroupProps;

const ContextMenuRadioGroup = RxContextMenu.ContextMenuRadioGroup;

type ContextMenuRadioItemProps = RxContextMenu.ContextMenuRadioItemProps & {
  colorScheme?: ContextMenuColorScheme;
  icon?: ReactNode;
};

const ContextMenuRadioItem = forwardRef<HTMLDivElement, ContextMenuRadioItemProps>(
  (
    { className, children, colorScheme, icon = <DotFilledIcon />, ...props },
    ref
  ) => {
    return (
      <RxContextMenu.RadioItem
        className={contextMenuItemVariants({
          className: cn(
            "flex items-center",
            "pr-3",
            "text-[14px]",
            "relative",
            "rounded-sm",
            "focus:cursor-default",
            className
          ),
          colorScheme: colorScheme ?? useColorScheme()
        })}
        {...props}
        ref={ref}
      >
        <div className="w-7 flex justify-center items-center">
          <RxContextMenu.ItemIndicator>{icon}</RxContextMenu.ItemIndicator>
        </div>
        {children}
      </RxContextMenu.RadioItem>
    );
  }
);

type ContextMenuSubProps = RxContextMenu.ContextMenuSubProps;

const ContextMenuSub = RxContextMenu.ContextMenuSub;

type ContextMenuSubTriggerProps = RxContextMenu.ContextMenuSubTriggerProps & {
  colorScheme?: ContextMenuColorScheme;
  leftIcon?: ReactNode;
  icon?: ReactNode;
};

const ContextMenuSubTrigger = forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  (
    {
      className,
      children,
      colorScheme,
      leftIcon,
      icon = <ChevronRightIcon />,
      ...props
    },
    ref
  ) => {
    return (
      <RxContextMenu.SubTrigger
        className={contextMenuItemVariants({
          className: cn(
            "flex justify-between items-center",
            "text-[14px]",
            "relative",
            "rounded-sm",
            "focus:cursor-default",
            className
          ),
          colorScheme: colorScheme ?? useColorScheme()
        })}
        {...props}
        ref={ref}
      >
        <div className="w-7 flex justify-center items-center">{leftIcon}</div>
        {children}
        <span className="ml-auto">{icon}</span>
      </RxContextMenu.SubTrigger>
    );
  }
);

type ContextMenuSubContentProps = RxContextMenu.ContextMenuSubContentProps;

const ContextMenuSubContent = forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxContextMenu.Portal>
        <RxContextMenu.SubContent
          className={cn(
            "min-w-fit h-fit",
            "p-1",
            "border border-[--gray-7]",
            "rounded",
            "shadow-lg",
            "bg-[--slate-1]",
            "text-[--slate-12]",
            "context-menu-content",
            className
          )}
          {...props}
          ref={ref}
        />
      </RxContextMenu.Portal>
    );
  }
);

type ContextMenuSeparatorProps = RxContextMenu.ContextMenuSeparatorProps;

const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxContextMenu.Separator
        className={cn("h-[1px] my-1", "bg-[--gray-7]", className)}
        {...props}
        ref={ref}
      />
    );
  }
);

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Label = ContextMenuLabel;
ContextMenu.Item = ContextMenuItem;
ContextMenu.CheckboxItem = ContextMenuCheckboxItem;
ContextMenu.RadioGroup = ContextMenuRadioGroup;
ContextMenu.RadioItem = ContextMenuRadioItem;
ContextMenu.Sub = ContextMenuSub;
ContextMenu.SubTrigger = ContextMenuSubTrigger;
ContextMenu.SubContent = ContextMenuSubContent;
ContextMenu.Separator = ContextMenuSeparator;

ContextMenu.displayName = RxContextMenu.Root.displayName;

export { ContextMenu };
export type {
  ContextMenuProps,
  ContextMenuColorScheme,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
  ContextMenuSeparatorProps
};
