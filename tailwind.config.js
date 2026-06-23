/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify all files where Tailwind class names may appear
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#24C9EA',
        'primary-light': '#7FD6EA',
        'primary-container': '#D6EDFB',
        secondary: '#C6CDF8',
        accent: '#FED7EE',

        // Status
        success: '#34C759',
        warning: '#FFB020',
        error: '#F04438',
        info: '#24C9EA',

        // Light theme
        'bg-light': '#F8FCFE',
        'surface-light': '#FFFFFF',
        'surface-variant-light': '#EEF8FC',
        'text-primary-light': '#123043',
        'text-secondary-light': '#5D7482',
        'text-disabled-light': '#A6B4BE',

        // Dark theme
        'bg-dark': '#0B1720',
        'surface-dark': '#122330',
        'surface-variant-dark': '#193241',
        'text-primary-dark': '#F5FAFC',
        'text-secondary-dark': '#C2D3DD',
        'text-disabled-dark': '#6E8592',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        xxxl: '64px',
      },
    },
  },
  plugins: [],
};
