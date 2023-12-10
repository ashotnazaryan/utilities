import { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '1024px',
        'lg': '1280px'
      }
    }
  },
  plugins: []
};

export default config;
