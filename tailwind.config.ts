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
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.24)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
