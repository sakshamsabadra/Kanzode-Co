import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1e3a5f",
        paper: "#ffffff",
        brass: "#3b82f6",
        moss: "#1e40af",
        cloud: "#eff6ff",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a5f",
          950: "#172554"
        }
      },
      boxShadow: {
        panel: "0 24px 80px rgba(30, 58, 95, 0.08)"
      },
      backgroundImage: {
        "premium-radial":
          "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
