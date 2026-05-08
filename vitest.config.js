import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { chromium } from 'playwright';

const chromeArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
];

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
      instances: [
        {
          browser: 'chromium',
          headless: true,
          provider: playwright({
            launchOptions: {
              args: chromeArgs,
              executablePath: process.env.CHROME_BIN || chromium.executablePath(),
            },
          }),
        },
      ],
    },
  },
});
