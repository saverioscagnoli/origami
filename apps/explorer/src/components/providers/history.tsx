import { HistoryContext } from "@contexts/history";
import { useAccessor } from "@hooks/use-accessor";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { useProvider } from "@hooks/use-provider";
import { whenChanges } from "@life-cycle";

const HistoryProvider = useProvider(HistoryContext, () => {
  const { changeDir } = useNavigation();
  const { dir } = useCurrentDir();

  const history = useAccessor<string[]>([]);
  const index = useAccessor(0);

  const canGoBack = index.get() > 0;
  const canGoForward = index.get() < history.get().length - 1;

  const goBack = async () => {
    if (canGoBack) {
      console.log("go back");
      index.decrement(1);
      await changeDir(history.get()[index.get() - 1])();
    }
  };

  const goForward = async () => {
    if (canGoForward) {
      index.increment(1);
      await changeDir(history.get()[index.get() + 1])();
    }
  };

  whenChanges([dir.get()], () => {
    if (dir.get() === "") return;
    if (!history.get().includes(dir.get())) {
      history.set([...history.get(), dir.get()]);
      if (history.get().length > 0) {
        index.increment(1);
      }
    }
  });

  return { history, index, canGoBack, canGoForward, goBack, goForward };
});

export { HistoryProvider };
