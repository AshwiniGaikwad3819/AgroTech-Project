/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'Space Grotesk', 'Inter', 'sans-serif'],
        body: ['"Sora"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
            DEFAULT: '#1d76e5',
            dark: '#0f4fac',
            light: '#8fc7ff',
            muted: '#d9ecff',
        },
        accent: {
            DEFAULT: '#23c55e',
            dark: '#1b9f4c',
            light: '#5fe28f',
        },
        earthy: '#f2f4f7',
        charcoal: '#1b1f3b',
      },
      boxShadow: {
        soft: '0 20px 45px -24px rgba(15, 79, 172, 0.35)',
        card: '0 18px 30px -20px rgba(15, 79, 172, 0.45)',
      },
      backgroundImage: {
        'mesh':
          'radial-gradient(circle at 10% 20%, rgba(35,197,94,0.15) 0%, transparent 25%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.18) 0%, transparent 30%), radial-gradient(circle at 20% 80%, rgba(15,79,172,0.18) 0%, transparent 28%)',
        'grid': 'linear-gradient(rgba(15, 79, 172, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 79, 172, 0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

