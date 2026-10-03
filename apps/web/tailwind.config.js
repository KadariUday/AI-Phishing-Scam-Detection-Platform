/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          950: "#090D16", // Deep obsidian canvas
          900: "#0F1626", // Surface level 1
          850: "#131C31", // Surface level 2 (Cards)
          800: "#1A253E", // Elevated cards & dropdowns
          750: "#22304F", // Hover state
          700: "#2C3E63", // Interactive border
          600: "#3D527E", // Muted text/border
        },
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        accent: {
          indigo: "#6366F1",
          sky: "#0284C7",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          crimson: "#DC2626",
        },
        risk: {
          safe: "#10B981",
          low: "#06B6D4",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#EF4444",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Fira Code",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "card-subtle": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        "card-elevated": "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(59, 130, 246, 0.2)",
        "glow-brand": "0 0 25px -5px rgba(59, 130, 246, 0.3)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        "glow-crimson": "0 0 25px -5px rgba(239, 68, 68, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
