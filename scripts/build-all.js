import { build } from 'vite';
import { configs, version } from '../vite.config.js';
import AdmZip from 'adm-zip';

// build every files by iterating all styles
await Promise.all(Object.entries(configs).map(async([style, config], index) => {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }

  // minified build
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.min.js`; };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.min.[ext]`;
  config.build.rollupOptions.output.entryFileNames = `summernote-${style}.min.js`;
  await build(config);

  // non-minified build
  config.build.emptyOutDir = false;
  config.build.minify = false;
  config.build.terserOptions = { compress: false, mangle: false };
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.js`; };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.[ext]`;
  config.build.rollupOptions.output.entryFileNames = `summernote-${style}.js`;
  await build(config);
}));

// compress them all into a zip file for releasing
try {
  const zip = new AdmZip();
  const zipFilename = `summernote-${version}-dist.zip`;
  console.log(`Compressing dist files into ${zipFilename} ...`);
  zip.addLocalFolder('./dist');
  zip.writeZip(`dist/${zipFilename}`);
} catch (error) {
  console.error(`Failed to create zip file: ${error.message}`);
  process.exit(1);
}
