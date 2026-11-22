"use client";

import { SunMoon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={toggle}
    >
      <SunMoon size={18} aria-hidden="true" />
    </button>
  );
}
