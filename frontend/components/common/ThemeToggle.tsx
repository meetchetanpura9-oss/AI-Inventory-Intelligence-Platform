"use client";

import React, { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemeMode = "dark" | "light" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  // Load theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
      if (savedTheme) {
        requestAnimationFrame(() => {
          setTheme(savedTheme);
        });
      }
    } catch {}
  }, []);

  // Update classes when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t: ThemeMode) => {
      root.classList.remove("dark", "light");
      if (t === "dark") {
        root.classList.add("dark");
      } else if (t === "light") {
        root.classList.add("light");
      } else {
        // system theme fallback
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(isDark ? "dark" : "light");
      }
    };

    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}

    // Listen for system changes if system mode is active
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const cycleTheme = () => {
    const modes: ThemeMode[] = ["dark", "light", "system"];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const label = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition-all duration-200 hover:bg-muted hover:text-foreground"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${label}`}
    >
      <Icon className="size-5" />
    </button>
  );
}

export default ThemeToggle;
