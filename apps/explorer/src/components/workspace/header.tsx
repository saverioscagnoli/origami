import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@utils";
import { Flag, Weight } from "lucide-react";

const Header = () => {
  return (
    <div
      className={cn(
        "w-full h-6",
        "grid items-center grid-cols-4 gap-4",
        "px-2",
        "border-b border-[--gray-6]",
        "text-sm text-[--gray-10]",
        "shadow shadow-[--slate-4]"
      )}
    >
      <span>Name</span>
      <span className={cn("flex items-center gap-1")}>
        <p>Flags</p>
        <Flag size={14} />
      </span>
      <span className={cn("flex items-center gap-1")}>
        <p>Last Modified</p>
        <CalendarIcon width={14} height={14} />
      </span>
      <span className={cn("flex items-center gap-1")}>
        <p>Size</p>
        <Weight size={14} />
      </span>
    </div>
  );
};

export { Header };
