import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import { readFileSync } from 'fs';
import vitePostCSSSourceMap from './scripts/vite-plugins/vitePostCSSSourceMap.mjs';


const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const version = pkg.version;
const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
const banners = {
  'default': `
Summernote Next
Super simple WYSIWYG editor
Version ${version}
https://juergen-schwind.com/summernote-next

Copyright 2013-present Hackerwins and contributors
Copyright 2026-present Jürgen Schwind and contributors
Summernote Next may be freely distributed under the MIT license.

Date: ${date}
`,
  'minimal': `Summernote Next v${version} | (c) 2013-present Hackerwins and contributors | (c) 2026-present Jürgen Schwind and contributors | MIT license`,
};

const styles = [
  'bs5',
];
const defaultStyle = 'bs5';

let configs = {};
for (const style of styles) {
  configs[style] = defineConfig({
    // prevent to build twice while calling `build` function manually
    configFile: false,

    resolve: {
      alias: {
        '@': '/src',
      },
    },

    define: {
      __SUMMERNOTE_NEXT_VERSION__: JSON.stringify(version),
    },

    plugins: [
      banner((fileName) => {
        if (fileName.endsWith('.min.js')) return banners['minimal'];
        if (fileName.endsWith('.js')) return banners['default'];
      }),
      vitePostCSSSourceMap(),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },

    publicDir: false,

    build: {
      sourcemap: true,
      outDir: 'dist',

      lib: {
        entry: `/src/styles/${style}/summernote-${style}.js`,
        name: 'summernote',
        formats: ['iife'],
        fileName: () => 'summernote-next.js',
      },

      rollupOptions: {
        external: (id) => {
          if (id.startsWith('./font/')) return true; // do not bundle font files
          return false;
        },

        output: {
          assetFileNames: 'summernote-next.[ext]',
        },
      },
    },
  });
}

export default configs[defaultStyle];
export {
  configs,
  banners,
  version,
};
