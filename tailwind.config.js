/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Inconsolata"', 'monospace'],
      },
      colors: {
        accent: {
          pink: '#ffE6E6', // light pink
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
  
  