module.exports = {
  files: './src/icons/*.svg',
  dest: './dist/font/',
  formats: ['ttf', 'eot', 'woff', 'woff2'],
  fontName: 'summernote',
  template: './src/icons/templates/summernote-icons.css',
  destTemplate: './src/styles/',
  templateFontName: 'summernote',
  templateClassName: 'note-icon',
  templateFontPath: './font/',
  fixedWidth: false,
  normalize: true,
};
