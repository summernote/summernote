module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    colors: true,
    logLevel: config.LOG_INFO,
    files: [
      { pattern: 'src/js/**/*.js' },
      { pattern: 'test/**/*.spec.js' }
    ],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [ "--no-sandbox" ]
      },
      'SL_IE10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '10.0',
        platform: 'windows 8',
      },
      'SL_IE11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '11.0',
        platform: 'windows 8.1',
      },
      'SL_CHROME': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '70',
        platform: 'windows 8',
      },
      'SL_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: 'latest',
        platform: 'windows 8',
      },
    },
    // Chrome, ChromeCanary, Firefox, Opera, Safari, IE
    browsers: ['ChromeHeadlessNoSandbox', 'SL_IE10', 'SL_IE11', 'SL_CHROME', 'SL_FIREFOX'],
    sauceLabs: {
      testName: 'unit tests for summernote',
      startConnect: false,
      username: 'summernoteis',
      accessKey: '3d57fd7c-72ea-4c79-8183-bbd6bfa11cc3',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER,
      tags: [process.env.TRAVIS_BRANCH, process.env.TRAVIS_PULL_REQUEST],
    },
    preprocessors: {
      'src/js/**/*.js': ['karma-typescript'],
      'test/**/*.spec.js': ['karma-typescript']
    },
    reporters: ['dots', 'karma-typescript'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      includeAllSources: true
    },
    browserNoActivityTimeout: 60000,
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      include: [
        'test/**/*.spec.js'
      ],
      bundlerOptions: {
        entrypoints: /\.spec\.js$/,
        transforms: [require("karma-typescript-es6-transform")()],
        exclude: [
          'node_modules'
        ],
        sourceMap: true,
        addNodeGlobals: false
      },
      compilerOptions: {
        "module": "commonjs"
      }
    }
  });
};
