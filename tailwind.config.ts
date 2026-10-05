import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f5f4",
        foreground: "#111111",
        panel: "#ffffff",
        muted: "#6b7280",
        border: "rgba(255,255,255,0.08)",
        accent: "#34d186",
        accentDark: "#22b86e",
        // Admin surface scale — layered dark theme used across admin pages
        surface: {
          deep:     "#060908",
          base:     "#0A0E0C",
          raised:   "#0F1512",
          elevated: "#141C18",
          overlay:  "#1A231F",
        },
        hairline: {
          soft:     "rgba(255,255,255,0.05)",
          DEFAULT:  "rgba(255,255,255,0.08)",
          strong:   "rgba(255,255,255,0.14)",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.24)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -32px rgba(0,0,0,0.9)",
        cardHover: "0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 80px -32px rgba(0,0,0,0.95)",
        glow: "0 10px 40px -12px rgba(52,209,134,0.5)",
        pill: "0 1px 0 rgba(255,255,255,0.06) inset, 0 1px 2px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        "admin-gradient":
          "radial-gradient(1200px 480px at 85% -10%, rgba(52,209,134,0.12), transparent 55%), radial-gradient(900px 500px at -10% 110%, rgba(52,209,134,0.06), transparent 60%)",
        "card-sheen":
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 40%)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
