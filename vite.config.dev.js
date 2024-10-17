import { defineConfig } from 'vite';
import externalGlobals from 'rollup-plugin-external-globals';

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