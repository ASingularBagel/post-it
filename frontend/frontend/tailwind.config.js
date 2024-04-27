import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem', 
        '9xl': '96rem'
      }, 
      fontFamily: {
        'jetbrains': 'JetBrains Mono, monospace'
      }, 
      width: {
        'card-w': '400px', 
        'icon-w': '50px'
      }, 
      height: {
        'card-h' : '400px', 
        'icon-h': '50px',
      }, 
      animation: {
        'gradient-x':'gradient-x 10s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '100% 100%',
            'background-position': '100% 0',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '200% 0',
          },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
      screens: {
        'xs': '640px'
      }, 
      backgroundColor: {
        'general-bg': '#282A36',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active'],
      animation: ['hover'],
      transitionProperty: ['responsive', 'hover', 'focus'],
      transitionDuration: ['responsive', 'hover', 'focus'],
    },
  },
  daisyui: {
    themes: [
      "sunset", 
      "dim", 
      "dracula", 
      "dark", 
      "light", 
      "black", 
      "luxury"
    ]
  },
  plugins: [
    daisyui, 
  ],
  optimizeDeps: {
    include: ['dayjs']
  },
  mode: 'jit',
}

