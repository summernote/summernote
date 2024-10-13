import { build } from 'vite';
import { configs, banners } from '../vite.config.js';

// build every files by iteratinge all styles
for (const [index, [style, config]] of Object.entries(configs).entries()) {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }

  // minified build
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.min.js` };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.min.[ext]`;
  await build(config);

  // non-minified build
  config.build.minify = false;
  config.build.terserOptions = { compress: false, mangle: false };
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.js` };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.[ext]`;
  await build(config);
}
