import { build } from 'vite'
import { configs } from './vite.config.js'

for (const [index, [style, config]] of Object.entries(configs).entries()) {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }

  console.log(index, style);
  console.log(config);
  // production build
  await build(config);

/*
  // non-minified build
  config.build = {
    ...config.build,
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  };
  config.rollupOptions.output.assetfileNames = `summernote-${style}.min.[ext]`,

  await build(config);
  */
}
