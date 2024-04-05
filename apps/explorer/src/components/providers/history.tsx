import { HistoryContext } from "@contexts/history";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";

const HistoryProvider = useProvider(HistoryContext, () => {
  const history = useAccessor<string[]>([]);
  const index = useAccessor(0);

  const canGoBack = index.get() > 0;
  const canGoForward = index.get() < history.get().length - 1;

  const goBack = () => {
    if (canGoBack) {
      index.set(index.get() - 1);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      index.set(index.get() + 1);
    }
  };

  return { history, index, canGoBack, canGoForward, goBack, goForward };
});

export { HistoryProvider };
