const webfont = require('webfont').default;
const fs = require('fs');
const path = require('path');

const webfontConfig = {
  files: 'src/icons/*.svg',
  dest: 'src/styles/font/',
  formats: ['ttf', 'eot', 'woff', 'woff2'],
  fontName: 'summernote',
  template: 'src/icons/templates/summernote-icons.scss',
  destTemplate: 'src/styles/summernote-icons.scss',
  templateFontName: 'summernote',
  templateClassName: 'note-icon',
  templateFontPath: './font/',
  fixedWidth: false,
  normalize: true,
};

// eslint-disable-next-line
console.log('Building fonts...');

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
    let file = null;

    if (type !== 'template') {
      file = path.resolve(path.join(webfontConfig['dest'], webfontConfig['fontName'] + '.' + type));
    } else {
      file = path.resolve(webfontConfig['destTemplate']);
    }
    // eslint-disable-next-line
    console.log('Writing ', file);

    fs.writeFileSync(file, content);
  });
}).catch(error => {
  // eslint-disable-next-line
  console.log(error);
  throw error;
});
