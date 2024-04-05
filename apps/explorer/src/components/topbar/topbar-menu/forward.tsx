import { useHistory } from "@hooks/use-history";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const Forward = () => {
  const { canGoForward, goForward } = useHistory();

  return (
    <Menubar.Item
      leftIcon={<ArrowRightIcon />}
      disabled={!canGoForward}
      onClick={goForward}
    >
      Forward
    </Menubar.Item>
  );
};

export { Forward };
