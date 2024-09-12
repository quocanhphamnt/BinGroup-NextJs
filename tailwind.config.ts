import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      '2md': '992px',
      // => @media (min-width: 992px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1360px',
      // => @media (min-width: 1360px) { ... }

      '3xl': '1440px'
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontSize: {
        10: '10px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        28: '28px',
        30: '30px',
        32: '32px',
        34: '34px',
        36: '36px',
        38: '38px',
        40: '40px',
        44: '44px',
        48: '48px',
        56: '56px',
        64: '64px',
        72: '72px'
      },
      lineHeight: {
        1: '1',
        '1-1': '1.1',
        '1-2': '1.2',
        '1-3': '1.3',
        '1-4': '1.4',
        '1-5': '1.5',
        '1-6': '1.6',
        2: '2'
      },
      colors: {
        primary: {
          DEFAULT: 'linear-gradient(225deg, #FF6A00 0%, #EE0979 100%)'
        },
        secondary: {
          DEFAULT: 'linear-gradient(216deg, #00C6FF 15.48%, #0072FF 110.47%)'
        },
        orange: {
          1: '#FF7D3C',
          2: '#FF935D',
          3: '#FFA87D',
          4: '#FFBE9E',
          5: '#FFD4BE',
          6: '#FFE9DE',
          7: '#FF7F3E',
          8: '#FFF8F5'
        },
        yellow: {
          1: '#FABE5A',
          2: '#FBC976',
          3: '#FCD491',
          4: '#FDDFAD',
          5: '#FDE9C8',
          6: '#FEF4E3',
          7: '#F8B95C',
          8: '#FFF8F5'
        },
        teal: {
          1: '#008291',
          2: '#2B97A3',
          3: '#55ACB6',
          4: '#80C1C8',
          5: '#AAD5DA',
          6: '#D4EAED',
          7: '#233638',
          8: '#F2F9F9'
        },
        blue: {
          1: '#006EB4',
          2: '#2B86C1',
          3: '#559ECD',
          4: '#80B7DA',
          5: '#AACFE6',
          6: '#D4E7F2',
          7: '#FCFEFF'
        },
        ocean: {
          1: '#003282',
          2: '#2B5497',
          3: '#5576AC',
          4: '#8099C1',
          5: '#AABBD5',
          6: '#D4DDEA'
        },
        black: {
          1: '#000000',
          2: '#333333',
          3: '#666666',
          4: '#999999',
          5: '#3B3A3C',
        },
        red: {
          1: '#EB001B',
          2: '#C91F26'
        },
        gray: {
          1: '#C1C1C1',
          2: '#E1E1E1',
          3: '#F1F1F1',
          4: '#F5F5F5',
          5: '#F3F3F3',
          6: '#E4E9F1',
          7: '#F6F8F9',
          8: '#e1e1e180',
          9: '#8B8B8B',
        }
      },
      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1172px'
        },
        padding: {
          DEFAULT: '16px'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(77.29deg, #FF7F3E 40.8%, #F8B95C 100%)',
        'gradient-secondary': 'linear-gradient(77.29deg, #008291 40.8%, #006EB4 100%)'
      },
      boxShadow: {
        1: '0px 4px 10px 0px rgba(0, 0, 0, 0.20)',
        2: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)',
        3: '0px 4px 6px 0px rgba(0, 0, 0, 0.15)',
        4: '0px 6px 12px 0px rgba(0, 0, 0, 0.15)',
        5: '0px 2px 4px 0px rgba(0, 0, 0, 0.1)',
        6: '0px 4px 6px 0px rgba(0, 0, 0, 0.16)',
        7: '0px 4px 4px 0px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
}

export default config
