import { webfont } from 'webfont';
import fs from 'fs';
import path from 'path';

const webfontConfig = {
  files: 'src/font/icons/*.svg',
  dest: 'font/',
  formats: ['ttf', 'eot', 'woff', 'woff2'],
  fontName: 'summernote',
  template: 'src/font/template.scss',
  destTemplate: 'src/styles/summernote/font.scss',
  templateFontName: 'summernote',
  templateClassName: 'note-icon',
  templateFontPath: '../font/',
  fixedWidth: false,
  normalize: true,
};

 
console.log('Building fonts...');

fs.mkdirSync(path.resolve(webfontConfig.dest), { recursive: true });
fs.mkdirSync(path.dirname(path.resolve(webfontConfig.destTemplate)), { recursive: true });

webfont(webfontConfig).then(result => {
  Object.keys(result).map(type => {
    if (
      type === 'config' ||
      type === 'usedBuildInTemplate' ||
      type === 'glyphsData'
    ) {
      return;
    }

    const content = result[type];
    const file = type !== 'template'
      ? path.resolve(path.join(webfontConfig['dest'], webfontConfig['fontName'] + '.' + type))
      : path.resolve(webfontConfig['destTemplate']);
     
    console.log('Writing ', file);

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  });
}).catch(error => {
   
  console.log(error);
  throw error;
});
