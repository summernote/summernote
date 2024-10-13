import { defineConfig, build } from 'vite'
import externalGlobals from 'rollup-plugin-external-globals';

const styles = [
  'lite',
  'bs3', 'bs4', 'bs5',
];
const defaultStyle = 'lite';

let configs = {};
for (const style of styles) {
  configs[style] = defineConfig({
    resolve: {
      alias: {
        '@': '/src',
      },
    },

    plugins: [
      externalGlobals({
        jquery: '$'
      }),
    ],

    build: {
      sourcemap: true,

      lib: {
        entry: `/src/styles/${style}/summernote-${style}.js`,
        name: 'summernote',
        formats: ['iife'],
        fileName: (format, entryName) => `${entryName}.js`,
      },

      rollupOptions: {
        external: (id) => {
          if (id === 'jquery') return true; // do not bundle jQuery
          if (id.startsWith('./font/')) return true; // do not bundle font files
          return false;
        },

        output: {
          assetFileNames: `summernote-${style}.[ext]`,
          globals: {
            jquery: 'jQuery'
          }
        },
      }
    }
  })
};

export default configs[defaultStyle];
export {configs};
