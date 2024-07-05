import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  test: {
    globals: true,
    setupFiles: [
      './test/vitest.setup.js'
    ],

    browser: {
      enabled: true,
      headless: true,
      name: 'chrome',
    },
  },
});
