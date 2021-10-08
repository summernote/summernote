var webpackConfig = require('../config/webpack.karma.js');

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'webpack'],
    colors: true,
    logLevel: config.LOG_INFO,

    browsers: ['ChromeDebug'],
    customLaunchers: {
      ChromeDebug: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"]
      }
    },

    files: [
      '../node_modules/jquery/dist/jquery.js',
      { pattern: '../src/js/**/*.js' },
      { pattern: '../test/**/*.spec.js' }
    ],

    preprocessors: {
      '../src/js/**/*.js': ['webpack', ],
      '../test/**/*.spec.js': ['webpack', ],
    },

    webpack: webpackConfig,

    reporters: ['dots'],
    browserNoActivityTimeout: 60000,
  });
};
