import { cn } from "@lib/utils";
import { BottombarItemCount } from "./item-count";
import { BottombarOperationDisplay } from "./operations";

const Bottombar = () => {
  // const [copied, setCopied] = useState<number>(0);
  // const [total, setTotal] = useState<number>(0);

  // useTauriEvent(EventFromBackend.CopyProgress, payload => {
  //   const { data } = payload;

  //   setCopied(data.copied);
  //   if (total === 0) {
  //     setTotal(data.total);
  //   }
  // });

  return (
    <div
      className={cn(
        "w-full h-6",
        "fixed bottom-0 left-0",
        "flex items-center justify-between",
        "text-xs",
        "px-6",
        "border-t border-t-[--gray-6]"
      )}
    >
      <BottombarItemCount />
      <BottombarOperationDisplay />
      {/* {total !== 0 && <Progress value={copied} max={total} />} */}
    </div>
  );
};

export { Bottombar };
