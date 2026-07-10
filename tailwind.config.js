/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 60px rgba(124, 92, 255, .28)",
        "inner-line": "inset 0 1px 0 rgba(255,255,255,.12)"
      }
    }
  },
  plugins: []
};
