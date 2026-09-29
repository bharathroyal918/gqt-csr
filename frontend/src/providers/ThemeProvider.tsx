"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
  themes: string[];
  systemTheme?: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
  themes: ["light", "dark", "system"],
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "gqt_theme",
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>("light");
  const [resolvedTheme, setResolvedTheme] = useState<string>("light");
  const [, startTransition] = useTransition();

  // Initialize theme from localStorage or default on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setThemeState(stored);
      } else {
        setThemeState(defaultTheme);
      }
    } catch {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Synchronize document classes & system theme listener
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDOM = (current: string) => {
      let resolved = current;
      if (current === "system") {
        resolved = mediaQuery.matches ? "dark" : "light";
      }
      setResolvedTheme(resolved);

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
      } else {
        root.setAttribute(attribute, resolved);
      }
    };

    updateDOM(theme);

    const handleSystemChange = () => {
      if (theme === "system") {
        updateDOM("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, attribute]);

  const setTheme = (newTheme: string) => {
    startTransition(() => {
      setThemeState(newTheme);
    });
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Storage access might fail in private browsing mode
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        themes: ["light", "dark", "system"],
        systemTheme: resolvedTheme === "dark" ? "dark" : "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
