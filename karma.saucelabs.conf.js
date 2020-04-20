var webpackConfig = require('./config/webpack.config.dev.js');

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', ],
    concurrency: 3,
    colors: true,
    logLevel: config.LOG_INFO,
    files: [
      'node_modules/jquery/dist/jquery.js',
      { pattern: 'src/js/**/*.js' },
      { pattern: 'test/**/*.spec.js' }
    ],
    customLaunchers: {
      'SL_WINDOWS_IE10': {
        base: 'SauceLabs',
        browserName: 'Internet Explorer',
        version: '10.0',
        platform: 'Windows 8',
      },
      'SL_WINDOWS_IE11': {
        base: 'SauceLabs',
        browserName: 'Internet Explorer',
        version: '11.0',
        platform: 'Windows 10',
      },
      'SL_WINDOWS_EDGE': {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest',
        platform: 'Windows 10',
      },
      'SL_WINDOWS_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'Firefox',
        version: 'latest',
        platform: 'Windows 10',
      },
      'SL_WINDOWS_CHROME': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        version: 'latest',
        platform: 'Windows 10',
      },
      'SL_LINUX_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'Firefox',
        version: 'latest',
        platform: 'Linux',
      },
      'SL_MACOS_CHROME': {
        base: 'SauceLabs',
        browserName: 'Chrome',
        version: 'latest',
        platform: 'macOS 10.14',
      },
      'SL_MACOS_SAFARI': {
        base: 'SauceLabs',
        browserName: 'Safari',
        version: 'latest',
        platform: 'macOS 10.14',
      },
      'SL_MACOS_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'Firefox',
        version: 'latest',
        platform: 'macOS 10.14',
      },
    },
    browsers: [
      //'SL_WINDOWS_IE10',
      //'SL_WINDOWS_IE11',
      'SL_WINDOWS_EDGE',
      'SL_WINDOWS_CHROME',
      'SL_WINDOWS_FIREFOX',
      'SL_MACOS_CHROME',
      'SL_MACOS_SAFARI',
      'SL_MACOS_FIREFOX',
      //'SL_LINUX_FIREFOX',
    ],
    sauceLabs: {
      testName: 'local unit tests for summernote',
    },
    preprocessors: {
      'src/js/**/*.js': ['webpack'],
      'test/**/*.spec.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    reporters: ['dots'],

    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 60000,
    singleRun: true,
  });
};
