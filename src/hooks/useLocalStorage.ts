import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // storage full or unavailable
    }
  }, [key, stored]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStored((prev) => (value instanceof Function ? (value as (val: T) => T)(prev) : value));
  }, []);

  return [stored, setValue];
}
