/**
 * eventHandler.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('editor', ['w3cRange', 'style'], function(w3cRange, style) {
  /**
   * bold
   */
  var bold = function() {
    console.log('bold');
    //var range = w3cRange.createFromNative();
    //var aText = range.nodes(true, dom.isText);
    //style.styleNode(range);
  };
  
  return {
    bold: bold
  }
});
