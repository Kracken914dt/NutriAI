/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#006e2f",
        "secondary": "#0058be",
        "tertiary": "#565e74",
        "background": "#f8f9ff",
        "surface": "#f8f9ff",
        "error": "#ba1a1a",
        "primary-container": "#22c55e",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3d4a3d",
        "outline-variant": "#bccbb9",
        "surface-container": "#e5eeff",
        "surface-container-low": "#eff4ff",
        "surface-container-highest": "#d3e4fe",
        "inverse-surface": "#213145",
        "on-tertiary-fixed": "#131b2e"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
