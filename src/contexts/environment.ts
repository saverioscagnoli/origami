import { useAccessor } from "@hooks/use-accessor";
import {
  createContextHook,
  createContextProvider,
  resolveBasicDirs
} from "@lib/utils";
import { BasicDir } from "@typings/basic-dir";
import { createContext, useEffect } from "react";

type EnvironmentContextValue = {
  basicDirs: BasicDir[];
};

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

const useEnvironment = createContextHook(EnvironmentContext, "Environment");

const EnvironmentProvider = createContextProvider(EnvironmentContext, () => {
  const basicDirs = useAccessor<BasicDir[]>([]);

  useEffect(() => {
    resolveBasicDirs().then(basicDirs.set);
  }, []);

  return {
    basicDirs: basicDirs()
  };
});

export { useEnvironment, EnvironmentProvider };
