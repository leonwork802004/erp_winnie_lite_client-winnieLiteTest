import { debounce } from "lodash-es";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export const useSessionStorageState = <T>(
  key: string,
  initialValue: T | (() => T),
  isPathname: boolean = true
): [T, Dispatch<SetStateAction<T>>] => {
  const { pathname } = useLocation();
  const storageKey = isPathname ? pathname + "-" + key : "-" + key;

  const [state, setState] = useState<T>(() => {
    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    const storedValue = sessionStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  const handleDebouncedUpdate = useMemo(
    () =>
      debounce((newState: T) => {
        sessionStorage.setItem(storageKey, JSON.stringify(newState));
      }, 500),
    [storageKey]
  );

  useEffect(() => {
    handleDebouncedUpdate(state);
  }, [handleDebouncedUpdate, state]);

  return [state, setState];
};
