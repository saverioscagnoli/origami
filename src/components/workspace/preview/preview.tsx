import { useCurrentDir } from "@zustand/curent-dir-store";
import { AudioPreview } from "./audio";
import { ImagePreview } from "./image";

const validImages = ["jpg", "jpeg", "png", "gif", "webp", "ico", "bmp"];
const validAudios = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];

const Preview = () => {
  const [selected] = useCurrentDir(state => [state.selected]);
  const entry = selected.length === 1 ? selected.at(0) : null;

  if (!entry) return null;

  if (validImages.includes(entry.ext)) {
    return <ImagePreview path={entry.path} ext={entry.ext} />;
  }

  if (validAudios.includes(entry.ext)) {
    return <AudioPreview path={entry.path} ext={entry.ext} />;
  }
};

export { Preview };
