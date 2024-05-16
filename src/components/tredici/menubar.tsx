import { cn } from "@lib/utils";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons";
import * as RxMenubar from "@radix-ui/react-menubar";
import { cva } from "class-variance-authority";
import {
  FC,
  ReactNode,
  RefAttributes,
  RefObject,
  createContext,
  useContext
} from "react";

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

import "./menubar.css";

type MenubarComponent = FC<MenubarProps & RefAttributes<HTMLDivElement>> & {
  Menu: typeof MenubarMenu;
  Trigger: typeof MenubarTrigger;
  Content: typeof MenubarContent;
  Label: typeof MenubarLabel;
  Item: typeof MenubarItem;
  CheckboxItem: typeof MenubarCheckboxItem;
  RadioGroup: typeof MenubarRadioGroup;
  RadioItem: typeof MenubarRadioItem;
  Sub: typeof MenubarSub;
  SubTrigger: typeof MenubarSubTrigger;
  SubContent: typeof MenubarSubContent;
  Separator: typeof MenubarSeparator;
  Arrow: typeof MenubarArrow;
};

type MenubarColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w"
  | "gray";

const ColorSchemeContext = createContext<MenubarColorScheme | null>(null);

const useColorScheme = () => {
  const ctx = useContext(ColorSchemeContext);

  if (!ctx) {
    throw new Error(
      "Menubar compound components must be used within a Menubar component"
    );
  }

  return ctx;
};

const menubarItemVariants = cva(["outline-none"], {
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

type MenubarProps = RxMenubar.MenubarProps & {
  colorScheme?: MenubarColorScheme;
  ref?: RefObject<HTMLDivElement>;
};

const Menubar: MenubarComponent = ({
  className,
  colorScheme = "plum",
  ref,
  ...props
}) => {
  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <RxMenubar.Root
        className={cn(
          "w-fit",
          "flex justify-between items-center",
          "p-1",
          className
        )}
        {...props}
        ref={ref}
      />
    </ColorSchemeContext.Provider>
  );
};

type MenubarMenuProps = RxMenubar.MenubarMenuProps;

const MenubarMenu = RxMenubar.Menu;

type MenubarTriggerProps = RxMenubar.MenubarTriggerProps & {
  ref?: RefObject<HTMLButtonElement>;
};

const MenubarTrigger: FC<MenubarTriggerProps> = ({ className, ref, ...props }) => {
  return (
    <RxMenubar.Trigger
      className={cn(
        "px-2",
        "rounded",
        "text-sm",
        "focus:bg-[--gray-4]",
        "outline-none",
        "data-[state='open']:bg-[--gray-4]",
        className
      )}
      {...props}
      ref={ref}
    />
  );
};

type MenubarContentProps = RxMenubar.MenubarContentProps & {
  ref?: RefObject<HTMLDivElement>;
};

const MenubarContent: FC<MenubarContentProps> = ({
  className,
  sideOffset = 4,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.Portal>
      <RxMenubar.Content
        className={cn(
          "min-w-fit h-fit",
          "p-1",
          "border border-[--gray-7]",
          "rounded",
          "shadow-lg",
          "bg-[--slate-1]",
          "text-[--slate-12]",
          "select-none",
          "menubar-content",
          className
        )}
        sideOffset={sideOffset}
        {...props}
        ref={ref}
      />
    </RxMenubar.Portal>
  );
};

type MenubarLabelProps = RxMenubar.MenubarLabelProps & {
  ref?: RefObject<HTMLDivElement>;
};

const MenubarLabel: FC<MenubarLabelProps> = ({ className, ref, ...props }) => {
  return (
    <RxMenubar.Label
      className={cn("pl-5 py-0.5 pb-1", "text-xs", className)}
      {...props}
      ref={ref}
    />
  );
};

type MenubarItemProps = RxMenubar.MenubarItemProps & {
  colorScheme?: MenubarColorScheme;
  leftIcon?: ReactNode;
  shortcut?: string;
  ref?: RefObject<HTMLDivElement>;
};

const MenubarItem: FC<MenubarItemProps> = ({
  className,
  children,
  colorScheme,
  leftIcon,
  shortcut,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.Item
      className={menubarItemVariants({
        className: cn(
          "flex items-center justify-between",
          "pr-2",
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
      <div className="flex items-center">
        <span className="w-7 flex justify-center items-center">{leftIcon}</span>
        {children}
      </div>
      {shortcut && <span className="ml-4 text-xs">{shortcut}</span>}
    </RxMenubar.Item>
  );
};

type MenubarCheckboxItemProps = RxMenubar.MenubarCheckboxItemProps & {
  colorScheme?: MenubarColorScheme;
  icon?: ReactNode;
  shortcut?: string;
  ref?: RefObject<HTMLDivElement>;
};

const MenubarCheckboxItem: FC<MenubarCheckboxItemProps> = ({
  className,
  children,
  colorScheme,
  checked,
  shortcut,
  icon = <CheckIcon />,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.CheckboxItem
      className={menubarItemVariants({
        className: cn(
          "flex justify-between items-center",
          "text-[14px]",
          "pr-2",
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
      <span className="flex items-center">
        <div className="w-7 flex justify-center items-center">
          <RxMenubar.ItemIndicator>{icon}</RxMenubar.ItemIndicator>
        </div>
        {children}
      </span>
      {shortcut && <span className="ml-4 text-xs">{shortcut}</span>}
    </RxMenubar.CheckboxItem>
  );
};

type MenubarRadioGroupProps = RxMenubar.MenubarRadioGroupProps;

const MenubarRadioGroup = RxMenubar.MenubarRadioGroup;

type MenubarRadioItemProps = RxMenubar.MenubarRadioItemProps & {
  colorScheme?: MenubarColorScheme;
  icon?: ReactNode;
  ref?: RefObject<HTMLDivElement>;
};

const MenubarRadioItem: FC<MenubarRadioItemProps> = ({
  className,
  children,
  colorScheme,
  icon = <DotFilledIcon />,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.RadioItem
      className={menubarItemVariants({
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
        <RxMenubar.ItemIndicator>{icon}</RxMenubar.ItemIndicator>
      </div>
      {children}
    </RxMenubar.RadioItem>
  );
};

type MenubarSubProps = RxMenubar.MenubarSubProps;

const MenubarSub = RxMenubar.MenubarSub;

type MenubarSubTriggerProps = RxMenubar.MenubarSubTriggerProps & {
  colorScheme?: MenubarColorScheme;
  leftIcon?: ReactNode;
  icon?: ReactNode;
  ref?: RefObject<HTMLDivElement>;
};

const MenubarSubTrigger: FC<MenubarSubTriggerProps> = ({
  className,
  children,
  colorScheme,
  leftIcon,
  icon = <ChevronRightIcon />,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.SubTrigger
      className={menubarItemVariants({
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
    </RxMenubar.SubTrigger>
  );
};

type MenubarSubContentProps = RxMenubar.MenubarSubContentProps & {
  ref?: RefObject<HTMLDivElement>;
};

const MenubarSubContent: FC<MenubarSubContentProps> = ({
  className,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.Portal>
      <RxMenubar.SubContent
        className={cn(
          "min-w-fit h-fit",
          "p-1",
          "border border-[--gray-7]",
          "rounded",
          "shadow-lg",
          "bg-[--slate-1]",
          "text-[--slate-12]",
          "select-none",
          "menubar-content",
          className
        )}
        {...props}
        ref={ref}
      />
    </RxMenubar.Portal>
  );
};

type MenubarSeparatorProps = RxMenubar.MenubarSeparatorProps & {
  ref?: RefObject<HTMLDivElement>;
};

const MenubarSeparator: FC<MenubarSeparatorProps> = ({
  className,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.Separator
      className={cn("h-[1px] my-1", "bg-[--gray-7]", className)}
      {...props}
      ref={ref}
    />
  );
};

type MenubarArrowProps = RxMenubar.MenubarArrowProps & {
  ref?: RefObject<SVGSVGElement>;
};

const MenubarArrow: FC<MenubarArrowProps> = ({
  width = 7,
  height = 4,
  className,
  ref,
  ...props
}) => {
  return (
    <RxMenubar.Arrow
      ref={ref}
      width={width}
      height={height}
      className={cn("fill-[--gray-7]", className)}
      {...props}
    />
  );
};

Menubar.Menu = MenubarMenu;
Menubar.Trigger = MenubarTrigger;
Menubar.Content = MenubarContent;
Menubar.Label = MenubarLabel;
Menubar.Item = MenubarItem;
Menubar.CheckboxItem = MenubarCheckboxItem;
Menubar.RadioGroup = MenubarRadioGroup;
Menubar.RadioItem = MenubarRadioItem;
Menubar.Sub = MenubarSub;
Menubar.SubTrigger = MenubarSubTrigger;
Menubar.SubContent = MenubarSubContent;
Menubar.Separator = MenubarSeparator;
Menubar.Arrow = MenubarArrow;

Menubar.displayName = RxMenubar.Root.displayName;

export { Menubar };
export type {
  MenubarArrowProps,
  MenubarCheckboxItemProps,
  MenubarColorScheme,
  MenubarContentProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarSeparatorProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps
};
