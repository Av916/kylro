"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "kylro-theme";
const CHANGE_EVENT = "kylro-theme-change";
let memoryTheme: Theme | undefined;
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
} | null>(null);

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("kylro-paper-theme");
    if (saved === "light" || saved === "dark") return memoryTheme ?? saved;
  } catch {
    /* Theme selection still works when storage is unavailable. */
  }
  return memoryTheme ?? "dark";
}
function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      memoryTheme = undefined;
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "dark" as const,
  );
  useEffect(() => {
    applyTheme(readTheme());
  }, [theme]);
  const setTheme = useCallback((next: Theme) => {
    memoryTheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Keep the in-memory preference. */
    }
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme, setTheme],
  );
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
export function useTheme() {
  const context = use(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

/** Apply the stored preference before the first paint on every route. */
export function ThemeScript() {
  const script = `(function(){var t='dark';try{var s=localStorage.getItem('kylro-theme')||localStorage.getItem('kylro-paper-theme');if(s==='light'||s==='dark')t=s}catch(e){}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
