import { Spinner } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { Command } from "@typings/enums";
import { useEffect, useState } from "react";

const validImages = ["jpg", "jpeg", "png", "gif", "webp"];

const ImagePreview = () => {
  const { selected } = useCurrentDir();
  const [base64, setBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      selected.length === 1 &&
      validImages.includes(selected.at(0).name.slice(-3))
    ) {
      setIsLoading(true);
      invoke(Command.GetImageBase64, { path: selected.at(0).path }).then(res => {
        setBase64(res.at(0));
        setIsLoading(false);
      });
    } else {
      setBase64("");
    }
  }, [selected]);

  return (
    <div
      className={cn(
        "w-1/3 h-1/3",
        "bg-[--slate-1]",
        "p-8",
        "shadow-md",
        "rounded-tl",
        "border border-b-0 border-[--gray-6]",
        "absolute bottom-0 right-6",
        "z-40",
        (isLoading || base64 !== "") && "!block",
        "hidden"
      )}
    >
      {isLoading ? (
        <Spinner size={40} />
      ) : (
        <img src={`data:image/png;base64,${base64}`} alt="preview" />
      )}
    </div>
  );
};

export { ImagePreview };
