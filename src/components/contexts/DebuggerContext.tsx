import {
  disableDebugger,
  enableDebugger,
  isDebuggerEnabled
} from '@/lib/debug';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';


// Context to provide and consume debugger information
const DebuggerContext = createContext({
  debuggers: new Map<string, boolean>(),
  toggleDebugger: (namespace: string) => {}
});

export const DebuggerProvider: React.FC = ({ children }: PropsWithChildren) => {
  
  const [debuggers, setDebuggers] = useState<Map<string, boolean>>(() => {
    const initialDebuggers = new Map<string, boolean>();
    const enabledNamespaces = (localStorage.getItem('debug') || '').split(',');
    enabledNamespaces.forEach(namespace => {
      initialDebuggers.set(namespace, isDebuggerEnabled(namespace));
    });
    return initialDebuggers;
  });

  // Function to toggle the enabled state of a debugger
  const toggleDebugger = (namespace: string) => {
    if (debuggers.get(namespace)) {
      disableDebugger(namespace);
    } else {
      enableDebugger(namespace);
    }
    setDebuggers(new Map(debuggers.set(namespace, !debuggers.get(namespace))));
  };

  return (
    <DebuggerContext.Provider value={{ debuggers, toggleDebugger }}>
      {children}
    </DebuggerContext.Provider>
  );
};

export const useDebuggers = () => useContext(DebuggerContext);
