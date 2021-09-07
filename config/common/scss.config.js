const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let postcssOptions = {
  plugins: [
    require("autoprefixer"),
    require("postcss-escape-generated-content-string"),
  ],
};

if (process.env.NODE_ENV === "production") {
  postcssOptions.plugins.push(
    require("cssnano")
  );
}

module.exports = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader:'postcss-loader',
      options: {
        postcssOptions,
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sourceMap: true,
      },
    },
  ],
};
