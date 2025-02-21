import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        en: ["Noto Serif", "serif"],
        ja: ["Noto Serif JP", "Noto Serif", "serif"],
        cn: ["Noto Serif SC", "Noto Serif", "serif"],
        "en-sans": ["Noto Sans", "sans-serif"],
        "ja-sans": ["Noto Sans JP", "Noto Sans", "sans-serif"],
        "cn-sans": ["Noto Sans SC", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} as Config;
