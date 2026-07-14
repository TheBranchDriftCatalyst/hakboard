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

// ---------- localStorage persistence ----------
// User-edited values persist across reloads under a single key. We store just
// the raw prop values per instance — schemas are re-attached when the widget
// registers on mount.

const STORAGE_KEY = "widget-config";

type PersistedValues = Record<string, Record<string, unknown>>;

const readPersistedValues = (): PersistedValues => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as PersistedValues;
    return {};
  } catch {
    return {};
  }
};

const writePersistedValues = (values: PersistedValues) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Private-mode Safari, quota exceeded, etc. Silently ignore.
  }
};

export const WidgetConfigProvider = ({ children }: PropsWithChildren) => {
  const [instances, setInstances] = useState<Record<string, InstanceRegistration>>({});
  // Persisted values are held in a ref so register() can consult them without
  // triggering re-renders. Hydrated once on mount.
  const persistedRef = useRef<PersistedValues>(readPersistedValues());

  const register = useCallback<ConfigActions["register"]>((key, schema, values, displayName) => {
    setInstances((prev) => {
      const existing = prev[key];
      const stored = persistedRef.current[key];
      // Precedence: existing in-memory values > persisted values > seed.
      // Persisted values are merged on top of the seed so newly-added schema
      // props still pick up their defaults.
      const nextValues = existing
        ? existing.values
        : stored
        ? { ...values, ...stored }
        : values;
      return { ...prev, [key]: { schema, values: nextValues, displayName } };
    });
  }, []);

  const unregister = useCallback<ConfigActions["unregister"]>((key) => {
    // Intentionally does NOT clear persistedRef / localStorage — a widget that
    // unmounts and later remounts should retain its user edits.
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
      const nextValues = { ...inst.values, [prop]: value };
      const nextPersisted = {
        ...persistedRef.current,
        [key]: { ...(persistedRef.current[key] ?? {}), [prop]: value },
      };
      persistedRef.current = nextPersisted;
      writePersistedValues(nextPersisted);
      return { ...prev, [key]: { ...inst, values: nextValues } };
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
