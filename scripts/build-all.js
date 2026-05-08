import { build } from 'vite';
import { configs, version } from '../vite.config.js';
import AdmZip from 'adm-zip';
import { buildLanguageAssets } from './build-language-assets.js';

// build every files by iterating all styles
await Promise.all(Object.values(configs).map(async(config, index) => {
  // clean dist directory only on first
  if (index > 0) {
    config.build.emptyOutDir = false;
  }

  // minified build
  config.build.lib.fileName = () => 'summernote-next.min.js';
  config.build.rollupOptions.output.assetFileNames = 'summernote-next.min.[ext]';
  config.build.rollupOptions.output.entryFileNames = 'summernote-next.min.js';
  await build(config);

  // non-minified build
  config.build.emptyOutDir = false;
  config.build.minify = false;
  config.build.terserOptions = { compress: false, mangle: false };
  config.build.lib.fileName = () => 'summernote-next.js';
  config.build.rollupOptions.output.assetFileNames = 'summernote-next.[ext]';
  config.build.rollupOptions.output.entryFileNames = 'summernote-next.js';
  await build(config);
}));

await buildLanguageAssets();

// compress them all into a zip file for releasing
try {
  const zip = new AdmZip();
  const zipFilename = `summernote-next-${version}-dist.zip`;
  console.log(`Compressing dist files into ${zipFilename} ...`);
  zip.addLocalFolder('./dist');
  zip.writeZip(`dist/${zipFilename}`);
} catch (error) {
  console.error(`Failed to create zip file: ${error.message}`);
  process.exit(1);
}
