import type { Config } from "tailwindcss";

const config: Config = {
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
      backgroundImage: {
        "radial-fade":
          "radial-gradient(52% 52% at 50% 50%, rgba(50, 75, 22, 0.11) 0%, rgba(50, 55, 75, 0) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
