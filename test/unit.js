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
  '../../test/unit/dom.spec',
  '../../test/unit/list.spec',
  '../../test/unit/range.spec',
  '../../test/unit/style.spec'
], function (domSpec, listSpec, rangeSpec, styleSpec) {
  /* global QUnit */
  QUnit.start();

  module('unit/dom');
  domSpec();
  module('unit/list');
  listSpec();
  module('unit/range');
  rangeSpec();
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
