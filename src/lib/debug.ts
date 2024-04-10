import debug from "debug";

// Storage map to keep track of registered debuggers
export const DEBUGGER_MAP: Map<string, debug.Debugger> = new Map();

// Function to create and register a debugger
export const createDebugger = (namespace: string): debug.Debugger => {
  const dbg = debug(namespace);
  DEBUGGER_MAP.set(namespace, dbg);
  return dbg;
};
