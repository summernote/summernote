import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const chromeArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
];
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  define: {
    __SUMMERNOTE_NEXT_VERSION__: JSON.stringify(pkg.version),
  },

  test: {
    globals: true,
    setupFiles: [
      './test/vitest.setup.js'
    ],
    coverage: {
      enabled: false,
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.js',
      ],
      exclude: [
        'test/**',
        'examples/**',
        'public/**',
        'dist/**',
        'font/**',
      ],
    },

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
