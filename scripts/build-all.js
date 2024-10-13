import { build } from 'vite';
import { configs } from '../vite.config.js';

// build every files by iteratinge all styles
for (const [index, [style, config]] of Object.entries(configs).entries()) {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }
  // do not build twice while calling `build` function manually below
  config.configFile = false;

  // minified build
  config.build.lib.fileName = `summernote-${style}.min.js`;
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.min.[ext]`;
  await build(config);

  // non-minified build
  config.build = {
    ...config.build,
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  };
  config.build.lib.fileName = `summernote-${style}.js`;
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.[ext]`;
  await build(config);
}
