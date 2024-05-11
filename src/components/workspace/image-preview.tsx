import { Spinner } from "@components/tredici";
import { cn } from "@lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/core";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEffect, useState } from "react";

const validImages = ["jpg", "jpeg", "png", "gif", "webp"];

const ImagePreview = () => {
  const selected = useCurrentDir(state => state.selected);
  const [base64, setBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      selected.length === 1 &&
      validImages.includes(selected.at(0).name.slice(-3))
    ) {
      setIsLoading(true);
      invoke<string>(CommandName.GetImageBase64, { path: selected.at(0).path }).then(
        res => {
          setBase64(res);
          setIsLoading(false);
        }
      );
    } else {
      setBase64("");
    }
  }, [selected]);

  const onClose = () => {
    setBase64("");
  };

  return (
    <div
      className={cn(
        "w-1/3 h-1/3",
        "bg-[--slate-1]",
        "p-8",
        "shadow-md",
        "rounded",
        "border  border-[--gray-6]",
        "absolute bottom-4 right-4",
        "z-40",
        {
          "!block": isLoading || base64 !== ""
        },
        "hidden"
      )}
    >
      <Cross1Icon
        className={cn(
          "absolute top-4 right-4",
          ["text-gray-500", "hover:text-gray-950"],
          ["dark:text-gray-400", "dark:hover:text-gray-300"]
        )}
        onClick={onClose}
      />
      <span className={cn("w-full h-full", "grid place-items-center")}>
        {isLoading ? (
          <Spinner size={40} />
        ) : (
          <img src={`data:image/png;base64,${base64}`} alt="preview" />
        )}
      </span>
    </div>
  );
};

export { ImagePreview };
