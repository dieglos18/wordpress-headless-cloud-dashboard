import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-svh bg-app-surface font-sans text-ink antialiased">
      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-app-card/95 backdrop-blur-md dark:border-white/8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-primary transition-colors hover:text-secondary dark:text-white dark:hover:text-secondary"
          >
            <img
              src="/wp-icon.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 object-contain"
              decoding="async"
            />
            Cloud Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
