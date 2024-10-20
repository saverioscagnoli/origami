import { cn } from "~/lib/utils";
import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type SpinnerColorScheme =
  | "plum"
  | "teal"
  | "grass"
  | "red"
  | "amber"
  | "blue"
  | "b/w";

type SpinnerSize = "sm" | "md" | "lg";

const spinnerVariants = cva(null, {
  variants: {
    colorScheme: {
      plum: "stroke-[--plum-9]",
      teal: "stroke-[--teal-9]",
      grass: "stroke-[--grass-9]",
      red: "stroke-[--red-9]",
      amber: "stroke-[--amber-9]",
      blue: "stroke-[--blue-9]",
      "b/w": "stroke-[--slate-12]"
    },
    size: {
      sm: "w-3 h-3",
      md: "w-5 h-5",
      lg: "w-7 h-7"
    }
  }
});

type SpinnerProps = ComponentPropsWithoutRef<"svg"> & {
  colorScheme?: SpinnerColorScheme;
  size?: SpinnerSize | number;
  noTrack?: boolean;
};

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  (
    { colorScheme = "plum", size = "md", noTrack = false, className, ...props },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 15 15"
        fill="none"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className={spinnerVariants({
          className: cn("animate-spin", className),
          size: typeof size !== "number" ? size : null
        })}
        {...props}
      >
        <circle
          cx="7.5"
          cy="7.5"
          r="5.75"
          stroke="#BDBDBD"
          strokeOpacity={noTrack ? 0 : 0.25}
          strokeWidth="1.5"
        />
        <mask id="path-2-inside-1_1_8" fill="white">
          <path d="M14 7.5C14 8.87312 13.5652 10.211 12.7578 11.3217C11.9505 12.4324 10.8122 13.2589 9.50606 13.6827C8.19997 14.1065 6.79322 14.1058 5.48757 13.6806C4.18191 13.2555 3.04443 12.4278 2.23824 11.3163L3.44687 10.4397C4.06787 11.2959 4.94408 11.9335 5.94982 12.2609C6.95557 12.5884 8.03919 12.589 9.04527 12.2625C10.0514 11.9361 10.9282 11.2994 11.5501 10.4438C12.172 9.58826 12.5069 8.55772 12.5069 7.5H14Z" />
        </mask>
        <path
          d="M14 7.5C14 8.87312 13.5652 10.211 12.7578 11.3217C11.9505 12.4324 10.8122 13.2589 9.50606 13.6827C8.19997 14.1065 6.79322 14.1058 5.48757 13.6806C4.18191 13.2555 3.04443 12.4278 2.23824 11.3163L3.44687 10.4397C4.06787 11.2959 4.94408 11.9335 5.94982 12.2609C6.95557 12.5884 8.03919 12.589 9.04527 12.2625C10.0514 11.9361 10.9282 11.2994 11.5501 10.4438C12.172 9.58826 12.5069 8.55772 12.5069 7.5H14Z"
          strokeWidth="3"
          mask="url(#path-2-inside-1_1_8)"
          className={spinnerVariants({ colorScheme })}
        />
      </svg>
    );
  }
);

export { Spinner };
export type { SpinnerColorScheme, SpinnerProps, SpinnerSize };
