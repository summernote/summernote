module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    colors: true,
    logLevel: config.LOG_INFO,
    files: [
      { pattern: 'src/js/**/*.js' },
      { pattern: 'src/js/**/*.ts' },
      { pattern: 'test/**/*.spec.js' },
      { pattern: 'test/**/*.spec.ts' }
    ],
    // Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
    browsers: ['ChromeHeadless'],
    preprocessors: {
      'src/js/**/*.js': ['karma-typescript'],
      'src/js/**/*.ts': ['karma-typescript'],
      'test/**/*.spec.js': ['karma-typescript'],
      'test/**/*.spec.ts': ['karma-typescript']
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
        'test/**/*.spec.js',
        'test/**/*.spec.ts'
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
