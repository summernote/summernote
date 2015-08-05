// Karma configuration
module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../',
    frameworks: ['requirejs', 'qunit'],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    files: [
      {pattern: 'src/js/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      'test/test-main.js'
    ],
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false
  });
};
