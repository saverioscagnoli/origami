// From: https://radix-ui.com/icons

import { SizeProps } from "@typings/props";
import { Component } from "solid-js";

const SquareIcon: Component<Partial<SizeProps>> = ({ size = 15 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1H1.5H13.5H14V1.5V13.5V14H13.5H1.5H1V13.5V1.5V1ZM2 2V13H13V2H2Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
};

export { SquareIcon };
