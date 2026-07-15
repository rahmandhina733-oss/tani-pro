import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // TaniPro brand palette
        tani: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        // Glassmorphism surfaces
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          md:      "rgba(255,255,255,0.08)",
          lg:      "rgba(255,255,255,0.12)",
          border:  "rgba(255,255,255,0.10)",
        },
        // Semantic tokens
        background: "#000000",
        foreground: "#f8fafc",
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        border: "rgba(255,255,255,0.10)",
        input:  "rgba(255,255,255,0.08)",
        ring:   "#10b981",
        primary: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.05)",
          foreground: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Core app gradient
        "app-gradient":
          "radial-gradient(ellipse at top right, #0f2a1a 0%, #0B1410 40%, #000000 100%)",
        // Card glow
        "card-glow":
          "radial-gradient(ellipse at top, rgba(16,185,129,0.08) 0%, transparent 70%)",
        // Emerald shimmer for active states
        "emerald-shimmer":
          "linear-gradient(135deg, #10b981 0%, #047857 50%, #10b981 100%)",
        // Hero gradient
        "hero-gradient":
          "linear-gradient(135deg, #0f2a1a 0%, #071a0f 50%, #000000 100%)",
        // Text gradient
        "text-emerald":
          "linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
        "text-white-fade":
          "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
      },
      boxShadow: {
        // Glow effects
        "emerald-sm":  "0 0 15px rgba(16,185,129,0.15)",
        "emerald-md":  "0 0 30px rgba(16,185,129,0.20)",
        "emerald-lg":  "0 0 60px rgba(16,185,129,0.25)",
        "emerald-xl":  "0 0 100px rgba(16,185,129,0.30)",
        // Card elevations
        "card":        "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
        "card-hover":  "0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.10)",
        "glass":       "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-hover": "0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(16,185,129,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
      },
      borderRadius: {
        xl:   "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(16,185,129,0.15)" },
          "50%":       { boxShadow: "0 0 40px rgba(16,185,129,0.30)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "counter-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%":            { transform: "scale(1.0)" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-in":         "fade-in 0.4s ease-out",
        "fade-in-scale":   "fade-in-scale 0.3s ease-out",
        "slide-in-right":  "slide-in-right 0.4s ease-out",
        "slide-in-left":   "slide-in-left 0.4s ease-out",
        "pulse-glow":      "pulse-glow 2s ease-in-out infinite",
        "float":           "float 3s ease-in-out infinite",
        "shimmer":         "shimmer 2.5s linear infinite",
        "spin-slow":       "spin-slow 8s linear infinite",
        "counter-up":      "counter-up 0.6s ease-out",
        "dot-bounce":      "dot-bounce 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
