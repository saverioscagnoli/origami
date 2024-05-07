import { Component, JSXElement, createMemo } from "solid-js";

type TopbarButtonProps = {
  /* The button's unique identifier */
  id: string;

  /* Button Icon */
  icon: JSXElement;

  /* onClick handler */
  onClick: () => void;

  /* Whether the button should be red */
  danger?: boolean;
};

const TopbarButton: Component<TopbarButtonProps> = ({
  id,
  icon,
  onClick,
  danger
}) => {
  const extraClass = createMemo(() => (danger ? "danger" : "normal"));

  return (
    <button id={id} class={`topbar-button ${extraClass()}`} onClick={onClick}>
      {icon}
    </button>
  );
};

export { TopbarButton };
