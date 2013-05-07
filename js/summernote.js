/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('summernote', ['renderer'], function(renderer) {
  var $ = jQuery;
  
  /*********************************
   * External jQuery Interface
   *********************************/
  $.fn.summernote = function() {
    // 01. initToolbar
    var welEditor = renderer.createLayout(this);
  }

  $.fn.finish = function() {
    renderer.removeLayout(this);
  }
});
