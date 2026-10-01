/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mousse: {
          DEFAULT: '#2E4036',
          dark: '#1C2922',
          deep: '#141E19',
          light: '#3D5447',
          muted: '#28382F',
        },
        argile: {
          DEFAULT: '#CC5833',
          hover: '#B54926',
          light: '#DC6C49',
          glow: 'rgba(204, 88, 51, 0.25)',
        },
        creme: {
          DEFAULT: '#F2F0E9',
          subtle: '#EAE7DD',
          card: '#FBF9F4',
          border: 'rgba(46, 64, 54, 0.12)',
        },
        charbon: {
          DEFAULT: '#1A1A1A',
          deep: '#111312',
          surface: '#222524',
          muted: '#8A918C',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'organic': '0 20px 40px -15px rgba(26, 26, 26, 0.07), 0 0 1px 1px rgba(46, 64, 54, 0.08)',
        'organic-lg': '0 30px 60px -20px rgba(26, 26, 26, 0.12), 0 0 1px 1px rgba(46, 64, 54, 0.1)',
        'accent-glow': '0 10px 30px -5px rgba(204, 88, 51, 0.35)',
      }
    },
  },
  plugins: [],
}
