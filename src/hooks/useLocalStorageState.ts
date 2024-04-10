"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Custom hook for managing state in local storage with synchronization across tabs/windows.
 * @template T
 * @param {string} key - The key to use in local storage.
 * @param {T} defaultValue - The default value to use if no value is found in local storage.
 * @returns {[T, Dispatch<SetStateAction<T>>]} - A tuple containing the stored value and a function to update it.
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() =>
    getFromLocalStorage(key, defaultValue),
  );

  useEffect(() => {
    // ensures that the state is updated when the corresponding local storage item changes in another tab or window.
    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        setState(getFromLocalStorage(key, defaultValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  useEffect(() => {
    setToLocalStorage(key, state);
  }, [key, state]);

  return [state, setState];
};
