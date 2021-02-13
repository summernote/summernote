const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let postcssOptions;
if (process.env.NODE_ENV === "production") {
  postcssOptions = {
    plugins: [require("autoprefixer"), require("cssnano") ],
  };
} else {
  postcssOptions = {
    plugins: [require("autoprefixer") ],
  };
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
