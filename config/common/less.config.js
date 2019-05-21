const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  test: /\.(le|c)ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader',
    },
    {
      loader: 'less-loader',
    },
  ],
};
