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
        cyber: {
          950: "#040711",
          900: "#080e1e",
          850: "#0d152a",
          800: "#131e38",
          750: "#1a294b",
          700: "#22355e",
          600: "#2e477d",
          500: "#3b82f6",
          400: "#60a5fa",
        },
        aurora: {
          cyan: "#00f5ff",
          teal: "#00e5a3",
          emerald: "#10b981",
          violet: "#7928ca",
          magenta: "#ff0080",
          amber: "#f59e0b",
          orange: "#ff5722",
          red: "#ff2a5f",
        },
        risk: {
          safe: "#00f0a8",
          low: "#00b4d8",
          medium: "#ffb703",
          high: "#fb8500",
          critical: "#ff0054",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "SF Mono", "Consolas", "monospace"],
      },
      animation: {
        "aurora-drift": "auroraDrift 20s ease-in-out infinite alternate",
        "pulse-radar": "radarPulse 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite",
        "scan-laser": "scanLaser 2.2s ease-in-out infinite alternate",
        "hud-glitch": "hudGlitch 4s ease-in-out infinite",
        "float-subtle": "floatSubtle 6s ease-in-out infinite",
      },
      keyframes: {
        auroraDrift: {
          "0%": { transform: "translate(0%, 0%) scale(1) rotate(0deg)" },
          "50%": { transform: "translate(5%, -8%) scale(1.1) rotate(5deg)" },
          "100%": { transform: "translate(-5%, 5%) scale(1.05) rotate(-5deg)" },
        },
        radarPulse: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "50%": { transform: "scale(1.2)", opacity: "0.2" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        scanLaser: {
          "0%": { top: "0%", opacity: "0.8" },
          "100%": { top: "96%", opacity: "0.8" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        }
      },
      boxShadow: {
        "hud-cyan": "0 0 25px -4px rgba(0, 245, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
        "hud-emerald": "0 0 25px -4px rgba(0, 240, 168, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
        "hud-red": "0 0 25px -4px rgba(255, 0, 84, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
        "neu-flat": "6px 6px 16px #03060c, -6px -6px 16px #0d1626",
        "neu-inset": "inset 3px 3px 6px #03060c, inset -3px -3px 6px #0d1626",
        "glass-elevated": "0 16px 36px -8px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
      }
    },
  },
  plugins: [],
}
