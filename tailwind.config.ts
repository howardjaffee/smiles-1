import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────────────────────
// ALIGNORA SMILES — design tokens
//
// Derived from the clinic signboard: charcoal wordmark on a warm off-white
// panel, a single amber accent chip, and a fine-line tooth/orthodontic
// bracket mark. The palette below keeps that restraint — one warm accent,
// one deep clinical teal for trust/medical credibility, and a quiet
// neutral scale for everything else — rather than the generic
// cream-and-terracotta or SaaS-card look.
// ─────────────────────────────────────────────────────────────────────────

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B1E24", // near-black charcoal, from the signboard wordmark
          50: "#F4F5F6",
          100: "#E6E8EA",
          200: "#C7CBD1",
          300: "#9DA3AD",
          400: "#6E7684",
          500: "#4C5462",
          600: "#363D49",
          700: "#282D37",
          800: "#1B1E24",
          900: "#111318",
        },
        paper: {
          DEFAULT: "#FBFAF8", // warm off-white, from the signboard panel
          muted: "#F3F1EC",
        },
        amber: {
          DEFAULT: "#DD7A2B", // signboard accent chip, precision/energy
          50: "#FDF3E9",
          100: "#FAE4CB",
          400: "#E69249",
          500: "#DD7A2B",
          600: "#B85F1C",
          700: "#914A17",
        },
        teal: {
          DEFAULT: "#0E5F58", // deep clinical teal, trust + medical credibility
          50: "#E9F3F2",
          100: "#CDE5E2",
          400: "#227B72",
          500: "#0E5F58",
          600: "#0A4A44",
          700: "#083A35",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,30,36,0.06), 0 8px 24px -12px rgba(27,30,36,0.12)",
      },
      keyframes: {
        "reveal": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        reveal: "reveal 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
