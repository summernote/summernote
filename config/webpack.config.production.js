const config = require('./common/production.common.config');
module.exports = {
  entry: {
    'summernote': './src/js/bs3/settings',
    'summernote-bs4': './src/js/bs4/settings',
    'summernote-lite': './src/js/lite/settings',
    'summernote-bs5': './src/js/bs5/settings',
    'summernote.min': './src/js/bs3/settings',
    'summernote-bs4.min': './src/js/bs4/settings',
    'summernote-lite.min': './src/js/lite/settings',
    'summernote-bs5.min': './src/js/bs5/settings',
    ...config.entries,
  },
  mode: 'production',
  optimization: config.optimization,
  output: config.output,
  externals: config.externals,
  devtool: config.devtool,
  module: config.module,
  plugins: config.plugins,
};
