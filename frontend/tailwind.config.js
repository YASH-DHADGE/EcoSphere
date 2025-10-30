/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ecoGreen: "#00A86B",
        ecoBlue: "#1D9BF0",
        ecoYellow: "#FFD700",
        ecoBrown: "#6B4423",
        ecoLight: "#E8F5E9",
        ecoDark: "#1B4332",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        eco: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        eco: "0 4px 20px rgba(0, 168, 107, 0.2)",
      },
    },
  },
  plugins: [],
}
