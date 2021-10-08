const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const path = require('path');

const pkg = require('../package.json');
const { styles, locales } = require('./common');

const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
const banner = `
Super simple WYSIWYG editor v${pkg.version}
https://summernote.org


Copyright 2013- Alan Hong and contributors
Summernote may be freely distributed under the MIT license.

Date: ${date}
`;
const minBanner = `Summernote v${pkg.version} | (c) 2013- Alan Hong and contributors | MIT license`;

module.exports = {
  mode: 'production',

  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    assetFilter: (name) => {
      return name.endsWith('.js');
    },
  },

  resolve: {
    roots: [path.resolve('./src')],
  },

  entry: Object.fromEntries([
    // entries for each style
    ...styles.map(style => 
      [`summernote-${style.id}`, `./src/styles/${style.id}/summernote-${style.id}.js`]
    ),
    // ... and for minimized
    ...styles.map(style => 
      [`summernote-${style.id}.min`, `./src/styles/${style.id}/summernote-${style.id}.js`]
    ),
    // entries for each locale
    ...locales.map(locale => 
      [`lang/${locale}`, `./src/locales/${locale}.js`]
    ),
    // ... and for minimized
    ...locales.map(locale => 
      [`lang/${locale}.min`, `./src/locales/${locale}.js`]
    ),
  ]),

  output: {
    publicPath: '/',
    path: path.join(__dirname, '../dist'),
    libraryTarget: 'umd',
  },

  externals: {
    jquery: {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
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
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer'),
                  require('postcss-escape-generated-content-string'),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: './font/[name][ext]',
        },
      },
    ],
  },

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

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: ({filename}) => {
        return filename.includes('.min.') ? minBanner : banner;
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'plugin',
          to: 'plugin',
        },
      ],
    }),
    new ZipPlugin({
      filename: `summernote-${pkg.version}-dist.zip`,
    }),
  ],

  devtool: 'source-map',
};
