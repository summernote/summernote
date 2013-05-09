/**
 * eventHandler.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('editor', ['dom', 'w3cRange', 'style'], function(dom, w3cRange, style) {
  /**
   * bold
   */
  var bold = function() {
    var range = w3cRange.createFromSelection();
    var aText = range.nodes(true, dom.isText);
  };
  
  return {
    bold: bold
  }
});
