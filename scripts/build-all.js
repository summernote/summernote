import { build } from 'vite';
import { configs, version } from '../vite.config.js';
import AdmZip from 'adm-zip';

// build every files by iteratinge all styles
for (const [index, [style, config]] of Object.entries(configs).entries()) {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }

  // minified build
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.min.js`; };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.min.[ext]`;
  await build(config);

  // non-minified build
  config.build.minify = false;
  config.build.terserOptions = { compress: false, mangle: false };
  config.build.lib.fileName = (format, entryName) => { return `${entryName}.js`; };
  config.build.rollupOptions.output.assetFileNames = `summernote-${style}.[ext]`;
  await build(config);
}

// compress them all into a zip file for releasing
const zip = new AdmZip();
const zipFilename = `summernote-${version}-dist.zip`;
console.log(`Compressing dist files into ${zipFilename} ...`);
zip.addLocalFolder('./dist');
zip.writeZip(`dist/${zipFilename}`);
