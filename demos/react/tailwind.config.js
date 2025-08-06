/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        apg: {
          primary: "#2563eb",
          "primary-hover": "#1d4ed8",
          "primary-dark": "#1e40af",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      minHeight: {
        touch: "44px",
      },
      ringWidth: {
        3: "3px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-down": "slideDown 0.2s ease-in-out",
        scale: "scale 0.1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scale: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
