import type { Config } from "tailwindcss";

const text = {
  primary: "#f2f4f8",
  secondary: "#a4adbe",
  tertiary: "#6f7888",
};

const line = {
  subtle: "rgba(255,255,255,0.06)",
  default: "rgba(255,255,255,0.10)",
  strong: "rgba(255,255,255,0.16)",
};

const config = {
  darkMode: ["class"],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Surface ladder: bg-bg-0 (page) → bg-bg-3 (pressed). Lighter = higher.
        "bg-0": "#0b0f17",
        "bg-1": "#111622",
        "bg-2": "#171d2b",
        "bg-3": "#1e2536",
        // Hairlines (also exposed as border-subtle / border-default / border-strong).
        line,
        // Single accent. `accent-text` is the only tint that passes AA on bg-0.
        accent: {
          DEFAULT: "#0066ff",
          foreground: "#ffffff",
          hover: "#1a75ff",
          active: "#0052cc",
          text: "#5c9dff",
          soft: "rgba(0,102,255,0.12)",
          ring: "rgba(0,102,255,0.45)",
        },
        success: "#3ddc84",
        // shadcn semantic hooks, remapped onto the ladder in globals.css.
        border: line.default,
        input: line.default,
        ring: "rgba(0,102,255,0.45)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Legacy names kept for sections not yet migrated; re-pointed at the ladder.
        "frost-white": text.primary,
        "frost-blue": text.secondary,
        "vivid-blue": "#0066ff",
        "cyber-dark": "#111622",
        "cyber-gray": "#171d2b",
      },
      // Text levels: text-primary / text-secondary / text-tertiary.
      // Scoped to textColor so bg-primary / bg-secondary keep their shadcn meaning.
      textColor: {
        primary: { DEFAULT: text.primary, foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: text.secondary, foreground: "hsl(var(--secondary-foreground))" },
        tertiary: text.tertiary,
      },
      borderColor: {
        DEFAULT: line.subtle,
        subtle: line.subtle,
        default: line.default,
        strong: line.strong,
      },
      divideColor: {
        subtle: line.subtle,
        default: line.default,
        strong: line.strong,
      },
      outlineColor: {
        subtle: line.subtle,
        default: line.default,
        strong: line.strong,
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Role-based type scale (mobile → desktop via clamp). One class per role.
      fontSize: {
        display: ["clamp(1.625rem, 0.6rem + 4.6vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        h1: ["clamp(2.125rem, 1.5rem + 2.75vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "600" }],
        h2: ["clamp(1.75rem, 1.25rem + 2.2vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        lede: ["clamp(1.0625rem, 0.95rem + 0.5vw, 1.25rem)", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        body: ["clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        small: ["clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem)", { lineHeight: "1.5", letterSpacing: "0" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" }],
        mono: ["clamp(0.75rem, 0.72rem + 0.2vw, 0.8125rem)", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" }],
      },
      maxWidth: {
        page: "1120px",
        prose: "680px",
        "hero-text": "560px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        // The only two shadows on the site: the dialog and the floating chat launcher.
        dialog: "0 24px 48px -12px rgba(0,0,0,0.5)",
        float: "0 8px 24px -8px rgba(0,0,0,0.5)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        "out-quart": "cubic-bezier(0.2, 0, 0, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "custom-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        500: "500ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%, 70%, 100%": { opacity: "1" },
          "20%, 50%": { opacity: "0" },
        },
        // Hairline light sweep: a half-width bar crosses its track, then rests.
        sweep: {
          "0%": { transform: "translate3d(-100%, 0, 0)" },
          "55%, 100%": { transform: "translate3d(200%, 0, 0)" },
        },
        "arrow-nudge": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(3px, 0, 0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        // Dashed SVG strokes flow along their path; offset is a multiple of every dash period used.
        "dash-flow": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        sweep: "sweep 2.4s cubic-bezier(0.2,0,0,1) 0.9s 1 both",
        "sweep-loop": "sweep 4s cubic-bezier(0.2,0,0,1) 0.9s infinite both",
        "arrow-nudge": "arrow-nudge 0.5s cubic-bezier(0.2,0,0,1) 1",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        "dash-flow": "dash-flow 1.2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
