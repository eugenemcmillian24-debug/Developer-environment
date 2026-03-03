import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080c10",
        panel: "#0d1117",
        border: "#1e2d3d",
        accent: "#00ff88",
        accent2: "#00c6ff",
        accent3: "#ff6b6b",
        accent4: "#ffd93d",
        text: "#c9d1d9",
        muted: "#4a5568",
        phase5: "#bd93f9",
        phase6: "#ffb86c",
      },
      fontFamily: {
        sans: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      animation: {
        "fade-down": "fadeDown 0.6s ease both",
        "fade-up": "fadeUp 0.6s ease both",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s cubic-bezier(0.4,0,0.2,1)",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0,255,136,0.7)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,255,136,0.3)",
        "glow-cyan": "0 0 20px rgba(0,198,255,0.3)",
        "glow-red": "0 0 20px rgba(255,107,107,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
