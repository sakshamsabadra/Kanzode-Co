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
        ink: "#000000",
        paper: "#ffffff",
        brass: "#777777",
        moss: "#333333",
        cloud: "#eeeeee"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(17, 17, 17, 0.08)"
      },
      backgroundImage: {
        "premium-radial":
          "radial-gradient(circle at top, rgba(119,119,119,0.1), transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
