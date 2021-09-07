const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const scssConfig = require('./scss.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const pkg = require('../../package.json');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
const banner = `
Super simple WYSIWYG editor v${pkg.version}
https://summernote.org


Copyright 2013- Alan Hong and other contributors
Summernote may be freely distributed under the MIT license.

Date: ${date}
`;
const minBanner = `Summernote v${pkg.version} | (c) 2013- Alan Hong and other contributors | MIT license`;

const productList = [
  'summernote',
  'summernote-bs4',
  'summernote-lite',
  'summernote.min',
  'summernote-bs4.min',
  'summernote-lite.min',
];

let entries = {};
fs.readdirSync(path.resolve(__dirname, '../../lang')).forEach(file => {
  const filename = file.replace('.js', '');
  const entryKey = `${filename}.min`;
  entries[entryKey] = `./lang/${filename}`;
  entries[filename] = `./lang/${filename}`;
});

module.exports = {
  entries,
  output: {
    publicPath: '/',
    path: path.join(__dirname, '../../dist'),
    libraryTarget: 'umd',
    filename: (chunkData) => {
      var isProduct = productList.includes(chunkData.chunk.name);
      return isProduct ? '[name].js' : 'lang/[name].js';
    },
  },
  externals: {
    jquery: {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery',
    },
  },
  devtool: false,
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\min\.js$/g,
        extractComments: false,
        terserOptions: {
          sourceMap: true,
          ecma: 8,
          compress: {
            warnings: false,
          },
        },
      }),
      new CssMinimizerPlugin({
        test: /\min\.css$/g,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
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
          }, {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      scssConfig,
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'font',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: ({filename}) => {
        return filename.includes('min') ? minBanner : banner;
      },
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'plugin',
          to: 'plugin',
        },
      ],
    }),
    new webpack.SourceMapDevToolPlugin({
      test: /(summernote|summernote\-bs4|summernote\-lite)(\.min)?\.js$/g,
      filename: '[name].js.map',
    }),
    new ZipPlugin({
      filename: `summernote-${pkg.version}-dist.zip`,
    }),
  ],
};
