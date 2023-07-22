import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        'custom-dark-green': '#3A7563',
        'custom-light-green': '#59A985',
        'custom-tan': '#E6D3A7',
        'custom-light-tan': '#F5E5BE',
        'custom-brown': '#392F2F',
        'custom-dark-brown': '#4A3728',
        'custom-light-brown': '#9F8170',
        'custom-off-white': '#EDEDED',
        'custom-red' : '#A95959',
      },
      height: {
        '92': '22.5rem',
        '100': '27rem',
      }
    },
  },
} as Options;
