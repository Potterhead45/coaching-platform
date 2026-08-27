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
        theme: {
          dark: '#003135',
          teal: '#024950',
          rust: '#964734',
          cyan: '#0FA4AF',
          ice: '#AFDDE5',
        },
        brand: {
          50: '#F2FAFB',
          100: '#AFDDE5', // Soft Ice Mint (#AFDDE5)
          200: '#80CAD4',
          300: '#4EB3C0',
          400: '#0FA4AF', // Vibrant Cyan (#0FA4AF)
          500: '#097E88',
          600: '#024950', // Rich Ocean Teal (#024950)
          700: '#023C42',
          800: '#003135', // Deep Base Teal (#003135)
          900: '#002629',
          950: '#001A1C',
        },
        rust: {
          50: '#FDF6F4',
          100: '#FAE8E4',
          200: '#F3CCC4',
          300: '#E6A799',
          400: '#BA5943',
          500: '#964734', // Terracotta Rust (#964734)
          600: '#833B2B',
          700: '#6C2F21',
          800: '#58251A',
          900: '#461D15',
        }
      },
    },
  },
  plugins: [],
};
export default config;
