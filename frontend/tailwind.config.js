/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        surface: "#1e1e2e",
        base: "#13131f",
      },
    },
  },
  plugins: [],
};
