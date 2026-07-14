import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

// ---------- Schema types ----------

export type ControlDef =
  | { type: "number"; default: number; min?: number; max?: number; step?: number; label?: string }
  | { type: "string"; default: string; label?: string }
  | { type: "boolean"; default: boolean; label?: string }
  | { type: "enum"; default: string; options: readonly string[]; label?: string };

export type ConfigSchema = Record<string, ControlDef>;

export type ConfigValues<S extends ConfigSchema> = {
  [K in keyof S]: S[K] extends { type: "number" }
    ? number
    : S[K] extends { type: "boolean" }
    ? boolean
    : S[K] extends { type: "string" | "enum" }
    ? string
    : never;
};

const defaultsFor = <S extends ConfigSchema>(schema: S): ConfigValues<S> => {
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(schema)) out[key] = def.default;
  return out as ConfigValues<S>;
};

// ---------- Per-instance ambient context ----------
// Set by <WidgetHost>: tells any useConfig() call which instance it belongs
// to, and provides the seed values the dashboard descriptor supplied.

interface InstanceAmbient {
  instanceKey: string;
  displayName?: string;
  initial: Record<string, unknown>;
}

const InstanceContext = createContext<InstanceAmbient | null>(null);

export const InstanceProvider = ({
  instanceKey,
  displayName,
  initial,
  children,
}: PropsWithChildren<InstanceAmbient>) => (
  <InstanceContext.Provider value={{ instanceKey, displayName, initial }}>
    {children}
  </InstanceContext.Provider>
);

// ---------- Config store ----------
// Holds current values + the registered schema + display name per instance.
// The sheet reads from this to render its list of controls.

export interface InstanceRegistration {
  schema: ConfigSchema;
  values: Record<string, unknown>;
  displayName: string;
}

// Split into two contexts:
//   * InstancesContext — the reactive state (changes on every register/patch)
//   * ActionsContext   — stable callbacks (register/unregister/patch), never changes
// Combining them into one context object caused a re-render loop: instances
// changed -> combined store identity changed -> useEffect in useConfig re-fired
// -> register() -> instances changed -> ...

interface ConfigActions {
  register: (key: string, schema: ConfigSchema, values: Record<string, unknown>, displayName: string) => void;
  unregister: (key: string) => void;
  patch: (key: string, prop: string, value: unknown) => void;
}

const InstancesContext = createContext<Record<string, InstanceRegistration>>({});
const ActionsContext = createContext<ConfigActions | null>(null);

export const WidgetConfigProvider = ({ children }: PropsWithChildren) => {
  const [instances, setInstances] = useState<Record<string, InstanceRegistration>>({});

  const register = useCallback<ConfigActions["register"]>((key, schema, values, displayName) => {
    setInstances((prev) => {
      const existing = prev[key];
      // Preserve user-modified values if the instance is already registered.
      const nextValues = existing ? existing.values : values;
      return { ...prev, [key]: { schema, values: nextValues, displayName } };
    });
  }, []);

  const unregister = useCallback<ConfigActions["unregister"]>((key) => {
    setInstances((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const patch = useCallback<ConfigActions["patch"]>((key, prop, value) => {
    setInstances((prev) => {
      const inst = prev[key];
      if (!inst) return prev;
      return { ...prev, [key]: { ...inst, values: { ...inst.values, [prop]: value } } };
    });
  }, []);

  const actions = useMemo<ConfigActions>(
    () => ({ register, unregister, patch }),
    [register, unregister, patch],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <InstancesContext.Provider value={instances}>{children}</InstancesContext.Provider>
    </ActionsContext.Provider>
  );
};

const useActions = (): ConfigActions => {
  const actions = useContext(ActionsContext);
  if (!actions) throw new Error("WidgetConfigProvider is missing from the tree");
  return actions;
};

export const useConfigInstances = () => useContext(InstancesContext);
export const usePatchConfig = () => useActions().patch;

// ---------- The hook widgets actually call ----------
// Merge order (lowest -> highest priority):
//   1. schema defaults
//   2. dashboard-descriptor `initial`  (via InstanceContext)
//   3. user changes from the control sheet  (via ConfigStoreContext)

export const useConfig = <S extends ConfigSchema>(schema: S): ConfigValues<S> => {
  const ambient = useContext(InstanceContext);
  if (!ambient) throw new Error("useConfig must be called inside a <WidgetHost>");
  const { instanceKey, displayName, initial } = ambient;
  const actions = useActions();
  const instances = useContext(InstancesContext);

  // Freeze schema identity across re-renders (widgets declare it inline `as const`,
  // so the object identity would otherwise change every render).
  const schemaRef = useRef(schema);

  const seed = useMemo(
    () => ({ ...defaultsFor(schemaRef.current), ...initial }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instanceKey],
  );

  useEffect(() => {
    actions.register(instanceKey, schemaRef.current, seed, displayName ?? instanceKey);
    return () => actions.unregister(instanceKey);
  }, [instanceKey, displayName, seed, actions]);

  const current = instances[instanceKey]?.values;
  return (current ?? seed) as ConfigValues<S>;
};
