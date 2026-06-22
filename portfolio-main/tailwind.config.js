module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        space: { 900: '#05050f', 800: '#080818', 700: '#0d0d25' },
      },
      animation: {
        'float':        'float-y 6s ease-in-out infinite',
        'float-slow':   'float-y 10s ease-in-out infinite',
        'spin-slow':    'spin 25s linear infinite',
        'spin-rev':     'spin-rev 20s linear infinite',
        'pulse-glow':   'pulse-glow 2.5s ease-in-out infinite',
        'gradient':     'grad-shift 5s ease infinite',
      },
      keyframes: {
        'float-y': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-22px)' },
        },
        'spin-rev': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '0.9', transform: 'scale(1.08)' },
        },
        'grad-shift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-cyan':   '0 0 30px rgba(6,182,212,0.4)',
        'glow-purple': '0 0 30px rgba(139,92,246,0.4)',
        'glow-pink':   '0 0 30px rgba(236,72,153,0.4)',
      },
    },
  },
  plugins: [],
}