/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.ts',
  ],
  theme: {
    extend: {
      maxWidth: {
        '3/5': '60%',
        '3/5vw': '60vw',
        '1/2': '50%',
        '1/2vw': '50vw',
        // Add more custom values if needed
      }
    },
  },
  plugins: [],
}
