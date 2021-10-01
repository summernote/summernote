const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const scssConfig = require('./common/scss.config');
const pkg = require('../package.json');
const { styles, locales, examples } = require('./common');

module.exports = {
  mode: 'development',

  resolve: {
    roots: [path.resolve('./src')],
  },

  entry: {
    // entries for each style
    ...Object.fromEntries(styles.map(style => 
      [`summernote-${style.id}`, `./src/styles/${style.id}/summernote-${style.id}.js`]
    )),
    // entries for each locale
    ...Object.fromEntries(locales.map(locale => 
      [`lang/${locale}`, `./src/locales/${locale}.js`]
    )),
  },

  externals: {
    jquery: 'jQuery', // dev includes jQuery by <script> tag
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '@@VERSION@@',
              replace: pkg.version,
            },
          },
          {
            loader: 'babel-loader',
          },
        ],
      },
      scssConfig,
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|otf|eot)$/,
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
    ...styles.map(style => 
      new HtmlWebPackPlugin({
        chunks: [`summernote-${style.id}`],
        template: `./src/styles/${style.id}/summernote-${style.id}.html`,
        styles: styles,
        filename: `summernote-${style.id}.html`,
      })
    ),
    new HtmlWebPackPlugin({
      template: `./examples/index.template`,
      filename: `examples.html`,
      examples,
    }),
  ],

  devtool: 'source-map',

  devServer: {
    port: 3000,
    open: [`/summernote-${styles[0].id}.html`],
  },
};
