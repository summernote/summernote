import { defineConfig } from 'vite'
import externalGlobals from 'rollup-plugin-external-globals';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  plugins: [
    externalGlobals({
      jquery: '$'
    })
  ],

  build: {
    rollupOptions: {
      external: ['jquery'],
      output: {
        globals: {
          jquery: 'jQuery'
        }
      }
    }
  }
})
