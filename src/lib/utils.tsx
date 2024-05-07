import { ChildrenProps } from "@typings/props";
import { Component, Context, useContext } from "solid-js";

/**
 * Util function to create a hook from a context
 *
 * @param Context The context to create the hook from
 * @param name The name of the context, used in the error message
 * @returns A hook that returns the context value
 */
function createContextHook<T>(Context: Context<T>, name: string) {
  return () => {
    const ctx = useContext(Context);

    if (!ctx) {
      throw new Error(`use${name} must be used within use${name}Provider`);
    }

    return ctx;
  };
}

/**
 * This function creates a provider component for a context
 *
 * @param Context The context to create the provider for
 * @param setupFn A function that returns the value for the context
 * @returns A provider component for the context
 */
function createContextProvider<T>(
  Context: Context<T>,
  setupFn: () => T
): Component<ChildrenProps> {
  return props => {
    const value = setupFn();

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };
}

/**
 * Format a number of bytes into a human-readable string
 * @param bytes The number to format
 * @param decimals How may decimal places to show
 * @returns A formatted string, e.g. "1.23 KB"
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export { createContextHook, createContextProvider, formatBytes };
