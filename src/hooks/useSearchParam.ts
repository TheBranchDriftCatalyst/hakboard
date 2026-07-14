import { useCallback, useEffect, useState } from "react";

const read = (key: string): string | null =>
  typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search).get(key);

export const useSearchParam = (key: string): string | null => {
  const [value, setValue] = useState<string | null>(() => read(key));

  const sync = useCallback(() => setValue(read(key)), [key]);

  useEffect(() => {
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [sync]);

  return value;
};
