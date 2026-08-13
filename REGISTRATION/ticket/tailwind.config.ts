import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          orange: "#EA580C",
          red: "#991B1B",
          dark: "#0F0F11",
          card: "#18181B",
          accent: "#F97316",
          gold: "#F59E0B"
        }
      },
    },
  },
  plugins: [],
};
export default config;
