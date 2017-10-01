module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    colors: true,
    logLevel: config.LOG_INFO,
    files: [
      {
        pattern: 'src/js/**/*.js',
        pattern: 'test/**/*.spec.js'
      }
    ],
    // Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
    browsers: ['Chrome'],
    singleRun: false,
    preprocessors: {
      'src/js/**/*.js': ['karma-typescript'],
      'test/**/*.js': ['karma-typescript']
    },
    reporters: ['dots', 'karma-typescript'],
    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage/',
      includeAllSources: true
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        entrypoints: /\.spec\.js$/,
        transforms: [
          require('karma-typescript-es6-transform')()
        ],
        exclude: [
          'node_modules'
        ],
        addNodeGlobals: false
      }
    }
  });
};
