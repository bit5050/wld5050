import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      colors: {
        black:  '#000000',
        white:  '#FFFFFF',
        gray: {
          50:  '#F7F7F7',
          100: '#F0F0F0',
          200: '#E0E0E0',
          400: '#9E9E9E',
          600: '#616161',
        },
        green: {
          DEFAULT: '#00C853',
          dim:     '#E8F5E9',
          text:    '#1B5E20',
        },
      },
      borderWidth: { DEFAULT: '0.5px', '1': '1px' },
      fontSize: {
        '10': ['10px', '14px'],
        '11': ['11px', '16px'],
      },
    },
  },
  plugins: [],
}

export default config
