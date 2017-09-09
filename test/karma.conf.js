// Karma configuration
module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../',
    frameworks: ['requirejs', 'mocha'],
    exclude: [],
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    files: [
      {pattern: 'src/js/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      {pattern: 'node_modules/chai/*.js', included: false},
      {pattern: 'node_modules/chai-spies/*.js', included: false},
      'test/test-main.js'
    ],
    // Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: false,
    preprocessors: {
      'src/js/**/!(app|intro|outro|ui|settings).js': 'coverage'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage/',
      includeAllSources: true
    }
  });
};
