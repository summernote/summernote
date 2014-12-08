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
  '../../test/unit/range.spec'
], function (domSpec, listSpec, rangeSpec) {
  /* global QUnit */
  QUnit.start();

  module('unit/dom');
  domSpec();
  module('unit/list');
  listSpec();
  module('unit/range');
  rangeSpec();
});
