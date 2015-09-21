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
    CodeMirror: '../../test/libs/codemirror'
  },

  shim: {
    CodeMirror: { exports: 'CodeMirror' }
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
      'summernote/base/core/agent',
      '../../test/unit/func.spec',
      '../../test/unit/key.spec',
      '../../test/unit/dom.spec',
      '../../test/unit/list.spec',
      '../../test/unit/range.spec',
      '../../test/unit/style.spec'
    ], function (agent, funcSpec, keySpec, domSpec, listSpec, rangeSpec, styleSpec) {

      var helper = {
        equalsToUpperCase: function (actual, expected, comment) {
          actual = actual.toUpperCase();
          expected = expected.toUpperCase();

          // [workaround] IE8-10 use &nbsp; instead of bogus br
          if (agent.isMSIE && agent.browserVersion < 11) {
            expected = expected.replace(/<BR>/g, '&NBSP;');
          }

          // [workaround] IE8 actual markup has newline between tags
          if (agent.isMSIE && agent.browserVersion < 9) {
            actual = actual.replace(/\r\n/g, '');
          }

          equal(actual, expected, comment);
        }
      };

      module('unit/func');
      funcSpec(helper);
      module('unit/key');
      keySpec(helper);
      module('unit/dom');
      domSpec(helper);
      module('unit/list');
      listSpec(helper);
      module('unit/range');
      rangeSpec(helper);
      module('unit/styleSpec');
      styleSpec();
    });


    /* jshint ignore:start */
    var log = [];
    QUnit.done(function (test_results) {
      var tests = [];
      for(var i = 0, len = log.length; i < len; i++) {
        var details = log[i];
        tests.push({
          name: details.name,
          result: details.result,
          expected: details.expected,
          actual: details.actual,
          source: details.source
        });
      }
      test_results.tests = tests;

      window.global_test_results = test_results;
    });
    QUnit.testStart(function(testDetails){
      QUnit.log(function(details){
        if (!details.result) {
          details.name = testDetails.name;
          log.push(details);
        }
      });
    });
    /* jshint ignore:end */

    // start test run, once Require.js is done
    window.__karma__.start();
  }
});
