import { useHistory } from "@hooks/use-history";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const Back = () => {
  const { canGoBack, goBack } = useHistory();

  return (
    <Menubar.Item
      leftIcon={<ArrowLeftIcon />}
      disabled={!canGoBack}
      onClick={goBack}
    >
      Back
    </Menubar.Item>
  );
};

export { Back };
