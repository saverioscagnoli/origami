import * as RxDialog from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { cn } from "@lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";

import "./dialog.css";

type DialogComponent = typeof RxDialog.Root & {
  Trigger: typeof DialogTrigger;
  Content: typeof DialogContent;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Close: typeof DialogClose;
};

type DialogProps = RxDialog.DialogProps;

const Dialog = RxDialog.Root as DialogComponent;

type DialogTriggerProps = RxDialog.DialogTriggerProps;

const DialogTrigger = RxDialog.Trigger;

type DialogContentProps = RxDialog.DialogContentProps;

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxDialog.Portal>
        <RxDialog.Overlay
          className={cn(
            "z-[9998]",
            "bg-black bg-opacity-30",
            "fixed inset-0",
            "dialog-overlay"
          )}
        />
        <RxDialog.Content
          className={cn(
            "z-[9999]",
            "w-11/12 max-w-[500px] max-h-[85vh]",
            "p-5",
            "relative",
            "rounded-md",
            "shadow-lg",
            "bg-[--slate-1]",
            "text-[--slate-12]",
            "border border-[--gray-7]",
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "focus:outline-none",
            "dialog-content",
            className
          )}
          ref={ref}
          {...props}
        />
      </RxDialog.Portal>
    );
  }
);

type DialogTitleProps = RxDialog.DialogTitleProps;

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <RxDialog.Title
        className={cn("text-xl font-bold", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

type DialogDescriptionProps = RxDialog.DialogDescriptionProps;

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <RxDialog.Description
      className={cn("mt-2", className)}
      ref={ref}
      {...props}
    />
  );
});

type DialogCloseProps = RxDialog.DialogCloseProps;

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) {
      return (
        <RxDialog.Close
          className={cn("absolute top-2 right-2", "p-1", className)}
          {...props}
          ref={ref}
        >
          <Cross1Icon
            className={cn(
              ["text-gray-500", "hover:text-gray-950"],
              ["dark:text-gray-400", "dark:hover:text-gray-300"]
            )}
          />
        </RxDialog.Close>
      );
    } else {
      return (
        <RxDialog.Close
          children={children}
          className={className}
          asChild
          {...props}
          ref={ref}
        />
      );
    }
  }
);

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;

Dialog.displayName = RxDialog.Root.displayName;

export { Dialog };
export type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps
};
