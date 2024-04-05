import { HistoryContext } from "@contexts/history";
import { createContextHook } from "@utils";

const useHistory = createContextHook(HistoryContext, "History");

export { useHistory };
