import React, { ReactNode } from "react";
import {
  ArrowLeftIcon,
  Cross1Icon,
  MinusIcon,
  SquareIcon
} from "@radix-ui/react-icons";
import { cn } from "@utils";
import { appWindow } from "@tauri-apps/api/window";
import { Button } from "@components/tredici";
import { useDirectory } from "@hooks/use-directory";
import { invoke } from "@tauri-apps/api";
import { DirEntry } from "@types";

type TopbarButtonProps = {
  onClick: () => void;
  icon: ReactNode;
  quitButton?: boolean;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({
  onClick,
  icon,
  quitButton
}) => {
  return (
    <button
      className={cn(
        "w-10 h-full",
        "inline-flex justify-center items-center",
        quitButton ? "hover:bg-[--tomato-9]" : "hover:bg-[--gray-3]",
        "transition-colors duration-75"
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const TopbarButtons = () => {
  const { dir, history, entries } = useDirectory();

  const back = () => {
    const h = history.get();

    invoke<DirEntry[]>("read_dir", { path: h.at(-1) }).then(e => {
      entries.set(e);
      dir.set(h.at(-1)!);
      history.set(h.slice(0, -1));
    });
  };

  return (
    <div className={cn("flex items-center")}>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<ArrowLeftIcon />}
        onClick={back}
      >
        Back
      </Button>
      <TopbarButton icon={<MinusIcon />} onClick={() => appWindow.minimize()} />
      <TopbarButton
        icon={<SquareIcon width={13} height={13} />}
        onClick={() => appWindow.toggleMaximize()}
      />
      <TopbarButton
        icon={<Cross1Icon />}
        onClick={() => appWindow.close()}
        quitButton
      />
    </div>
  );
};

export { TopbarButtons };
