/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--app-bg)",
          fg: "var(--app-fg)",
          border: "var(--app-border)",
        },
        nav: {
          fg: "var(--nav-fg)",
          hover: "var(--nav-hover)",
        },
        brand: {
          primary: "var(--brand-primary)",
          danger: "var(--brand-danger)",
        }
      }
    },
  },
  plugins: [],
}