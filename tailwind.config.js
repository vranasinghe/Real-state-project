/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#27AE60',
          hover: '#219653',
          light: '#E8F5E9',
        },
        darkGreen: '#1A3C34',
        textDark: '#1C1C1E',
        textMuted: '#6B7280',
        cardBg: '#F9FAFB',
        borderLight: '#E5E7EB',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
