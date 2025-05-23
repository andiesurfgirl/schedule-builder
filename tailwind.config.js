/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-inconsolata)', 'monospace'],
      },
      colors: {
        accent: {
          pink: '#ffE6E6', // light pink
        }
      }
    },
  },
  plugins: [],
}
  
  