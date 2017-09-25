/* global requirejs */
var tests = [];
for (var file in window.__karma__.files) {
  if (/spec\.js$/.test(file)) {
    tests.push(file);
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/src/js',

  paths: {
    jquery: '../../test/libs/jquery-1.9.1.min',
    bootstrap: '../../test/libs/bootstrap',
    es5shim: '../../test/libs/es5-shim',
    codemirror: '../../test/libs/codemirror',
    chai: '../../node_modules/chai/chai',
    spies: '../../node_modules/chai-spies/chai-spies',
    chaidom: '../../test/chaidom'
  },

  shim: {
    bootstrap: ['jquery'],
    es5shim: { exports: 'es5shim' },
    codemirror: { exports: 'codemirror' }
  },

  packages: [{
    name: 'summernote',
    location: '.',
    main: 'summernote'
  }],

  // ask Require.js to load these files (all our tests)
  deps: tests,

  callback: function () {
    require([
      'jquery',
      'bootstrap',
      'summernote/bs3/settings',
      'summernote/bs4/settings',
      'summernote/lite/settings'
    ], function () {
      window.__karma__.start();
    });
  }
});
