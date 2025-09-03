/** @type {import('tailwindcss').Config} */
// frontend/tailwind.config.js
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1a1a1a',
          dark: '#ffffff',
        },
        secondary: {
          light: '#2a2a2a',
          dark: '#f0f0f0',
        },
        accent: {
          light: '#4a90e2',
          dark: '#0066cc',
        },
        background: {
          light: '#ffffff',
          dark: '#000000',
        },
        backgroundDark: {
          light: '#f8f9fa',
          dark: '#1a1a1a',
        },
        foreground: {
          light: '#1a1a1a',
          dark: '#ffffff',
        },
        text: {
          light: {
            primary: '#1a1a1a',
            secondary: '#4a4a4a',
            muted: '#7a7a7a',
          },
          dark: {
            primary: '#ffffff',
            secondary: '#d0d0d0',
            muted: '#909090',
          },
        },
        border: {
          light: '#e0e0e0',
          dark: '#303030',
        },
      },
    },
  },
  plugins: [],
}