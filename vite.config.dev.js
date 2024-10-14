import { defineConfig, build } from 'vite';
import externalGlobals from 'rollup-plugin-external-globals';
import banner from 'vite-plugin-banner';
import * as glob from 'glob';

const examples = glob.sync('./examples/*.html').reduce((acc, it) => {
  acc[it] = it;
  return acc;
}, {});

const config = defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/examples/font': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/examples\/font/, '/font')
      },
    },
  },

  plugins: [
      externalGlobals({
        jquery: '$',
      }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },

  build: {

    rollupOptions: {
      input: {
        main: './index.html',
        ...examples,
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        chunkFileNames: `[name].js`,
        external: ['jquery'],
      },

    },
  },
});

export default config;