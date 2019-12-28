const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  test: /\.(sa|sc|c)ss$/,
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
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ],
};
