import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      fontFamily: {
        'golos': ['Golos Text', 'system-ui', 'sans-serif'],
        'mono':  ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in':  { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.94)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(20px) scale(0.96)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'window-open': { from: { opacity: '0', transform: 'scale(0.92) translateY(12px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'glow-pulse': { '0%,100%': { boxShadow: '0 0 20px rgba(14,165,233,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(14,165,233,0.6)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.25s ease both',
        'fade-out':       'fade-out 0.2s ease both',
        'scale-in':       'scale-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-up':       'slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
        'window-open':    'window-open 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
        'glow-pulse':     'glow-pulse 2s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
