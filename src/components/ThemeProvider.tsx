/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

const themes = {
  red: "oklch(67.28% 0.2147 24.22)",
  orange: "oklch(72.27% 0.1894 50.19)",
  amber: "oklch(84.08% 0.1725 84.2)",
  yellow: "oklch(86.03% 0.176 92.36)",
  lime: "oklch(83.29% 0.2331 132.51)",
  green: "oklch(79.76% 0.2044 153.08)",
  emerald: "oklch(77.54% 0.1681 162.78)",
  teal: "oklch(78.57% 0.1422 180.36)",
  cyan: "oklch(76.89% 0.139164 219.13)",
  sky: "oklch(66.9% 0.18368 248.8066)",
  blue: "oklch(67.47% 0.1726 259.49)",
  indigo: "oklch(66.34% 0.1806 277.2)",
  violet: "oklch(70.28% 0.1753 295.36)",
  purple: "oklch(71.9% 0.198 310.03)",
  fuchsia: "oklch(73.43% 0.2332 321.41)",
  pink: "oklch(71.5% 0.197 354.23)",
  rose: "oklch(70.79% 0.1862 16.25)",
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, string>;
};

const initialState: ThemeProviderState = {
  theme: "pink",
  setTheme: () => null,
  themes,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "pink",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...Object.keys(themes));
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    themes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
