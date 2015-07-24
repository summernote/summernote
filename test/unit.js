/**
 * test.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
require.config({
  baseUrl: '../src/js',
  paths: {
    jquery: '../../test/libs/jquery-1.9.1.min',
    CodeMirror: '../../test/libs/codemirror'
  },
  shim: {
    CodeMirror: { exports: 'CodeMirror' }
  },
  packages: [{
    name: 'summernote',
    location: './',
    main: 'summernote'
  }]
});

require([
  'summernote/core/agent',
  '../../test/unit/dom.spec',
  '../../test/unit/list.spec',
  '../../test/unit/range.spec',
  '../../test/unit/style.spec'
], function (agent, domSpec, listSpec, rangeSpec, styleSpec) {
  /* global QUnit */
  QUnit.start();

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
