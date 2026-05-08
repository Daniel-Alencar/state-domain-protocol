import { useEffect, useState } from "react";

const KEY = "ps:active-archetype";

type Listener = (value: string | null) => void;
const listeners = new Set<Listener>();

function read(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setActiveArchetype(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
  listeners.forEach((l) => l(id));
}

export function useActiveArchetype() {
  const [value, setValue] = useState<string | null>(() => read());
  useEffect(() => {
    setValue(read());
    const l: Listener = (v) => setValue(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return value;
}
