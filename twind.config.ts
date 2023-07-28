import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        'custom-dark-green': '#0B863B',
        'custom-light-green': '#51B700',
        'custom-tan': '#BE8452',
        'custom-light-tan': '#F5E5BE',
        'custom-brown': '#351D08',
        'custom-dark-main': '#1e1e1e',
        'custom-light-main': '#323332',
        'custom-off-white': '#EDEDED',
        'custom-red' : '#A95959',
        "custom-grey": "#545454"
      },
      height: {
        '92': '22.5rem',
        '98': '24.5rem',
        '100': '27rem',
        '105': '28.5rem',
        '120': '38.3rem',
      },
      width: {
        '92': '22.5rem',
        '98': '24.5rem',
        '100': '27rem',
        '105': '28.5rem',
        '110':'30.0rem',
        '120': '38.3rem',
        '150': '45rem',
      },
    },
  },
} as Options;
