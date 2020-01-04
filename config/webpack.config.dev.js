const config = require('./common/dev.common.config');
module.exports = {
  entry: {
    'summernote': './src/js/bs3/settings',
    'summernote-bs4': './src/js/bs4/settings',
    'summernote-lite': './src/js/lite/settings',
    ...config.entries,
  },
  output: config.output,
  externals: config.externals,
  devServer: config.devServer,
  module: config.module,
  plugins: config.plugins,
  devtool: 'source-map',
};
