"use client";

import { useState, useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "@/lib/utils/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => getLocalStorage(key, initialValue));

  useEffect(() => {
    setLocalStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
