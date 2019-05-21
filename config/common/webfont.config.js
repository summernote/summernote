module.exports = {
  files: './src/icons/*.svg',
  dest: './src/less/font/',
  formats: ['ttf', 'eot', 'woff', 'woff2'],
  fontName: 'summernote',
  template: './src/icons/templates/summernote.css',
  destTemplate: './src/less',
  templateFontName: 'summernote',
  templateClassName: 'note-icon',
  templateFontPath: './font/',
  fixedWidth: false,
  normalize: true,
};
