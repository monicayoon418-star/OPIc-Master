import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        toss: {
          blue: '#3182f6',
          blueHover: '#2272eb',
          blueLight: '#e8f3ff',
          dark: '#191f28',
          gray50: '#f9fafb',
          gray100: '#f2f4f6',
          gray200: '#e5e8eb',
          gray400: '#b0b8c1',
          gray500: '#8b95a1',
          gray600: '#6b7684',
          gray700: '#4e5968',
          gray800: '#333d4b',
          red: '#f04452',
          green: '#03b26c',
          yellow: '#ffc342',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
