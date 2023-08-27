import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-navy": "#043F67",
        "custom-gold": "#BB9F52",
        "custom-yellow": "#FCDF59",
      },
      fontFamily: {
        poppins: ["Poppins"],
        "dancing-script": ["Dancing Script", "cursive"],
        staatliches: ["Staatliches", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
