import { Callstack } from "@lib/callstack";
import { OperationType } from "@lib/operations";
import { createContextHook, createContextProvider } from "@lib/utils";
import { createContext, useEffect, useRef } from "react";

const CallstackContext = createContext<Callstack<OperationType> | null>(null);

const useCallstack = createContextHook(CallstackContext, "Callstack");

const CallstackProvider = createContextProvider(CallstackContext, () => {
  const ref = useRef(new Callstack());

  const callstack = ref.current;

  callstack.watchChanges();

  return callstack;
});

export { useCallstack, CallstackProvider };
