import { Cross1Icon } from "@radix-ui/react-icons";
import * as RxToast from "@radix-ui/react-toast";
import {
  Children,
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef
} from "react";
import { cn } from "~/lib/utils";

import "@radix-ui/colors/gray-dark.css";
import "@radix-ui/colors/gray.css";

import "@radix-ui/colors/slate-dark.css";
import "@radix-ui/colors/slate.css";

import "./toast.css";

type ToastComponent = ForwardRefExoticComponent<
  ToastProps & RefAttributes<HTMLLIElement>
> & {
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
};

type ToastProps = RxToast.ToastProps;

const Toast = forwardRef<
  HTMLLIElement,
  ToastProps & RxToast.ToastProviderProps
>(
  (
    {
      duration,
      label,
      swipeDirection,
      swipeThreshold,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    let childrenArr = Children.toArray(children);
    let [first, ...rest] = childrenArr;

    return (
      <RxToast.Provider
        duration={duration}
        label={label}
        swipeDirection={swipeDirection}
        swipeThreshold={swipeThreshold}
      >
        {first}
        <RxToast.Root
          children={rest}
          className={cn(
            "grid",
            "relative",
            "p-4",
            "bg-[--slate-1]",
            "border border-[--gray-7]",
            "rounded",
            "shadow",
            "toast-root",
            className
          )}
          style={{
            gridTemplateAreas: "'title action' 'description action'",
            gridTemplateColumns: "auto max-content",
            columnGap: "1rem",
            ...style
          }}
          {...props}
          ref={ref}
        />
        <RxToast.Viewport
          className={cn(
            "max-w-[100vw]",
            "flex flex-col gap-2",
            "p-4 m-0",
            "bottom-0 right-0",
            "fixed",
            "list-none",
            "z-50",
            "outline-none"
          )}
        />
      </RxToast.Provider>
    );
  }
) as ToastComponent;

type ToastTitleProps = RxToast.ToastTitleProps;

const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <RxToast.Title
        className={cn("text-lg", "font-semibold", className)}
        style={{ gridArea: "title", ...style }}
        {...props}
        ref={ref}
      />
    );
  }
);

type ToastDescriptionProps = RxToast.ToastDescriptionProps;

const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <RxToast.Description
        className={cn("text-sm", className)}
        style={{ gridArea: "description", ...style }}
        {...props}
        ref={ref}
      />
    );
  }
);

type ToastActionProps = RxToast.ToastActionProps;

const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ style, ...props }, ref) => {
    return (
      <RxToast.Action
        style={{
          gridArea: "action",
          ...style
        }}
        {...props}
        ref={ref}
      />
    );
  }
);

type ToastCloseProps = RxToast.ToastCloseProps;

const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) {
      return (
        <RxToast.Close
          className={cn("absolute top-0 right-0", "p-2", className)}
          {...props}
          ref={ref}
        >
          <Cross1Icon
            className={cn("text-[--gray-10]", "hover:text-[--gray-12]")}
          />
        </RxToast.Close>
      );
    } else {
      return (
        <RxToast.Close
          children={children}
          className={className}
          {...props}
          ref={ref}
        />
      );
    }
  }
);

Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
Toast.Action = ToastAction;
Toast.Close = ToastClose;

Toast.displayName = RxToast.Root.displayName;

export { Toast };
