import { useEffect, useState } from "react";

const read = (): string =>
  typeof window === "undefined" ? "/" : window.location.pathname;

export const usePathname = (): string => {
  const [pathname, setPathname] = useState<string>(() => read());

  useEffect(() => {
    const sync = () => setPathname(read());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return pathname;
};
