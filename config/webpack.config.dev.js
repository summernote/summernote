const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');
const { readdirSync } = require('fs');

const scssConfig = require('./common/scss.config');
const pkg = require('../package.json');

const styles = readdirSync("./src/styles", { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => name != 'summernote');

const locales = glob.sync("./src/locales/*.js")
  .map(f => path.basename(f, '.js'));

module.exports = {
  mode: 'development',

  resolve: {
    roots: [path.resolve('./src')],
  },

  entry: {
    // entries for each style
    ...Object.fromEntries(
      styles.map(f => [`summernote-${f}`, `./src/styles/${f}/summernote-${f}.js`])
    ),
    // entries for each locale
    ...Object.fromEntries(
      locales.map(f => [`lang/${f}`, `./src/locales/${f}.js`])
    ),
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
    ...styles.map(f => 
      new HtmlWebPackPlugin({
        chunks: [`summernote-${f}`],
        template: `./src/styles/${f}/summernote-${f}.html`,
        filename: `index-${f}.html`,
      })
    ),
  ],

  devtool: 'source-map',

  devServer: {
    port: 3000,
    open: ['/index-bs5.html'],
  },
};
