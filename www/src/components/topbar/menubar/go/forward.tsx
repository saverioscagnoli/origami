import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";

const ForwardMenuItem = () => {
  // const [history, index, goForward] = useCurrentDir(state => [
  //   state.history,
  //   state.historyIndex,
  //   state.goForward
  // ]);

  //const canGoForward = useMemo(() => index < history.length - 1, [index]);

  return (
    <Menubar.Item
      leftIcon={<ArrowRightIcon />}
      shortcut="Ctrl + Right"
      // disabled={!canGoForward}
      //onSelect={goForward}
    >
      Forward
    </Menubar.Item>
  );
};

export { ForwardMenuItem };
