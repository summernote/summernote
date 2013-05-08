/**
 * eventHandler.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('eventHandler', ['key', 'editor'], function(key, editor) {
  /**
   * hKeydown
   *
   * handle keydown event on editable area
   */
  var hKeydown = function(event) {
    if(event.metaKey && event.keyCode === key.B) { // bold
      editor.bold();
    }
  };
  
  /**
   * attach
   */
  var attach = function(layoutInfo) {
    layoutInfo.editable.bind('keydown', hKeydown);
  };
  
  /**
   * dettach
   */
  var dettach = function(layoutInfo) {
    layoutInfo.editable.unbind('keydown');
  };

  return {
    attach: attach,
    dettach: dettach
  }
});
