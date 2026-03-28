import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-app-card px-3 py-2 text-sm font-medium text-ink shadow-sm transition-colors hover:border-secondary/50 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:border-white/10 dark:bg-app-card dark:hover:bg-white/4"
    >
      {isDark ? (
        <Sun
          className="size-5 text-secondary"
          strokeWidth={1.5}
          aria-hidden
        />
      ) : (
        <Moon
          className="size-5 text-primary"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
