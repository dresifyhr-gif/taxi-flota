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
        background: "#0d1a10",
        foreground: "#f0f5f1",
        panel: "#172419",
        muted: "#5f8066",
        border: "rgba(255,255,255,0.08)",
        accent: "#22c55e",
        accentDark: "#16a34a",
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
