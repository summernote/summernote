const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const { defaultStyle, styles, languages, examples } = require('./common');

module.exports = {
  mode: 'development',

  resolve: {
    roots: [path.resolve('./src')],
  },

  entry: Object.fromEntries([
    // entries for each style
    ...styles.map(style => 
      [`summernote-${style.id}`, `./src/styles/${style.id}/summernote-${style.id}.js`]
    ),
    // entries for each language
    ...languages.map(lang => 
      [`lang/${lang}`, `./src/lang/${lang}.js`]
    ),
  ]),

  externals: {
    jquery: 'jQuery',
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|otf|eot)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'examples',
          to: 'examples',
        },
        {
          from: 'plugin',
          to: 'plugin',
        },
      ],
    }),
    // Testing pages for each style
    ...styles.map(style => 
      new HtmlWebPackPlugin({
        chunks: [`summernote-${style.id}`],
        template: `./src/styles/${style.id}/summernote-${style.id}.html`,
        styles: styles,
        filename: `summernote-${style.id}.html`,
      })
    ),
    // Generating the index page for examples from template
    new HtmlWebPackPlugin({
      chunks: [],
      template: `./examples/index.template`,
      filename: `examples.html`,
      examples,
    }),
  ],

  devtool: 'source-map',

  // Open the default style page for testing
  devServer: {
    port: 3000,
    open: [`/summernote-${defaultStyle}.html`],
  },
};
