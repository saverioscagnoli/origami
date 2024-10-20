import { ComponentProps, forwardRef } from "react";

const FolderIcon = forwardRef<SVGSVGElement, ComponentProps<"svg">>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={ref}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 11.5C1 12.3284 1.67157 13 2.5 13H12.5C13.3284 13 14 12.3284 14 11.5V5C14 4.17157 13.3284 3.5 12.5 3.5H9.5H7.83333C7.72515 3.5 7.61988 3.46491 7.53333 3.4L5.86667 2.15C5.73684 2.05263 5.57894 2 5.41667 2H2.5C1.67157 2 1 2.67157 1 3.5L1 6.5L1 11.5Z"
          fill={color}
        />
      </svg>
    );
  }
);

export { FolderIcon };
