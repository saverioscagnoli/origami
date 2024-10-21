import { cn } from "~/lib/utils";

type EntryLastModifiedProps = {
  LastModified: string;
};

const EntryLastModified: React.FC<EntryLastModifiedProps> = ({
  LastModified
}) => {
  return (
    <span className={cn("text-[--gray-8]", "whitespace-nowrap")}>
      {LastModified}
    </span>
  );
};

export { EntryLastModified };
