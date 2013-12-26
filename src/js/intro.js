/**
 * summernote.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'codemirror'], factory);
  } else {
    // Browser globals: jQuery, CodeMirror
    factory(window.jQuery, window.CodeMirror);
  }
}(function ($, CodeMirror) {
  'use strict';
