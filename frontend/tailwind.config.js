/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        retro: '4px 4px 0px #000000',
        'retro-sm': '2px 2px 0px #000000',
        'retro-lg': '6px 6px 0px #000000',
        'retro-xl': '8px 8px 0px #000000',
      },
      colors: {
        paper: '#f5f5f0',
      },
    },
  },
  plugins: [],
};
