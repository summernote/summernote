var webpackConfig = require('../config/webpack.karma.js');

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'webpack', ],
    concurrency: 3,
    colors: true,
    logLevel: config.LOG_INFO,
    files: [
      '../node_modules/jquery/dist/jquery.js',
      { pattern: '../src/js/**/*.js' },
      { pattern: '../test/**/*.spec.js' }
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
      'SL_WINDOWS_EDGE',
      'SL_WINDOWS_CHROME',
      'SL_WINDOWS_FIREFOX',
      //'SL_LINUX_FIREFOX',
      'SL_MACOS_CHROME',
      'SL_MACOS_SAFARI',
      'SL_MACOS_FIREFOX',
    ],
    sauceLabs: {
      testName: 'unit tests for summernote',
      startConnect: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER,
      tags: [process.env.TRAVIS_BRANCH, process.env.TRAVIS_PULL_REQUEST],
    },
    preprocessors: {
      '../src/js/**/*.js': ['webpack'],
      '../test/**/*.spec.js': ['webpack']
    },
    webpack: webpackConfig,
    reporters: ['dots', 'coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: '../coverage/',
      includeAllSources: true
    },
    browserNoActivityTimeout: 60000,
  });
};
