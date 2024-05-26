import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'primary': {
        DEFAULT: '#0e74e9',
        light: '#0eb6e9'
      },
      'secondary': '#7dd3fc',
      'fgcolor': '#f8fafc',
      'fgcolor-dark': '#1e293b',
      'bgcolor': '#e2e8f0',
      'bgcolor-dark': '#020617',
      'white': '#f8fafc',
      'red': '#dc2626',
      'red-light': '#f87171',
      'black': '#020617',
      'transparent': 'rgba(0,0,0,0)',
      'green': {
        DEFAULT: '#16a34a',
        light: '#4ade80',
      },
      'blue': {
        DEFAULT: '#0284c7',
        light: '#38bdf8',
      },
      'grey': 'rgba(135,133,133,0.8)',
      'orange': 'rgb(232,116,0)',
    },
  },
  plugins: [],
};
export default config;
