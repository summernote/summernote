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
    lib: {
      entry: {
        "lite": '/src/styles/lite/summernote-lite.js',
        "bs3": '/src/styles/bs3/summernote-bs3.js',
      },
      name: 'summernote',
      formats: ['es'],
      fileName: (format, entryName) => `summernote-${entryName}.js`,
    },

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
