import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

export default function vitePostCSSSourceMap() {
  return {
    name: 'vite-postcss-sourcemap',
    writeBundle(options, bundle) {
      const cssFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.css'));

      cssFiles.forEach(async(cssFile) => {
        const filePath = path.resolve(options.dir, cssFile);
        const css = fs.readFileSync(filePath, 'utf8');

        try {
          const result = await postcss([autoprefixer]).process(css, {
            from: cssFile,
            to: cssFile,
            map: { inline: false, annotation: true },
          });

          fs.writeFileSync(filePath, result.css);
          if (result.map) {
            fs.writeFileSync(`${filePath}.map`, result.map.toString());
          }

          console.log(`Generated source map for ${cssFile}`);
        } catch (error) {
          console.error(`Error processing ${cssFile}:`, error);
        }
      });
    },
  };
}