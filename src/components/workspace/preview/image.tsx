import { Spinner } from "@components/tredici";
import { cn, convertSrcBase64 } from "@lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/core";
import { CommandName } from "@typings/enums";
import { PreviewProps } from "@typings/props";
import { FC, useEffect, useState } from "react";

const ImagePreview: FC<PreviewProps> = ({ path, ext }) => {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    invoke<string>(CommandName.GetImageBase64, { path })
      .then(res => {
        setSrc(convertSrcBase64(res, ext, "image"));
        setLoading(false);
      })
      .catch(console.error);
  }, [path]);

  const onClose = () => setSrc("");

  return (
    (src || loading) && (
      <div
        className={cn(
          {
            "w-40 h-40": loading
          },
          "absolute bottom-4 right-5",
          "grid place-items-center",
          "bg-[--slate-1]",
          "p-8",
          "rounded-md",
          "border border-[--gray-6]",
          "z-40"
        )}
      >
        {loading ? (
          <Spinner size={30} />
        ) : (
          <img
            src={src}
            className={cn("max-w-80", "max-h-80", "rounded")}
            alt="preview"
          />
        )}
        <button
          className={cn(
            "w-fit h-fit",
            "absolute top-3 right-3",
            "inline-flex items-center justify-center"
          )}
          onClick={onClose}
        >
          <Cross1Icon />
        </button>
      </div>
    )
  );
};

export { ImagePreview };
