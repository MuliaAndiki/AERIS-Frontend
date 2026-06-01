/**
 * Semantic theme tokens. Color values are defined once in `globals.css` (:root).
 * Use Tailwind classes (`bg-primary`, `text-muted-foreground`) in JSX when possible.
 * Use this object only when a library needs inline colors (e.g. Recharts, SVG).
 */
export const theme = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
  },
  popover: {
    background: 'var(--popover)',
    foreground: 'var(--popover-foreground)',
  },
  primary: {
    background: 'var(--primary)',
    foreground: 'var(--primary-foreground)',
  },
  secondary: {
    background: 'var(--secondary)',
    foreground: 'var(--secondary-foreground)',
  },
  muted: {
    background: 'var(--muted)',
    foreground: 'var(--muted-foreground)',
  },
  accent: {
    background: 'var(--accent)',
    foreground: 'var(--accent-foreground)',
  },
  destructive: {
    background: 'var(--destructive)',
    foreground: 'var(--destructive-foreground)',
  },
  warning: {
    background: 'var(--warning)',
    foreground: 'var(--warning-foreground)',
  },
  success: {
    background: 'var(--success)',
    foreground: 'var(--success-foreground)',
  },
  info: {
    background: 'var(--info)',
    foreground: 'var(--info-foreground)',
  },
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
} as const;

export type ThemeTokens = typeof theme;
