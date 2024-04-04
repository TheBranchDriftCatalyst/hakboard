"use client";

import { useEffect, useState } from "react";

export const getFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') {
    return defaultValue; // Return default value if localStorage is not available
  }

  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

export const setToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getSavedLayoutNames = (): string[] | void => {
  if (typeof window === 'undefined') {
    return; // Return default value if localStorage is not available
  }
  return Object.keys(localStorage)
      .filter((key) => key.startsWith("layout:") || key === "layout:dirty")
      .map((key) => key.split(":")[1]);
};

// Why are we doing this?
// There is a state in which the dashboard is not yet saved but the browser reloads.
// say a user is constructing a dashboard and the browser crashes, the user will lose all the work.
// this allows us to persist some of the local state between refreshes
export const useLocalStorageControl = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() =>
    getFromLocalStorage(key, defaultValue)
  );

  useEffect(() => {
    setToLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
