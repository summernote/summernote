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
  /**
   * summernote 
   * create Editor Layout and attach Key and Mouse Event
   */
  $.fn.summernote = function(oOption) {
    renderer.createLayout(this);
    var info = renderer.layoutInfo(this);
    info.editable.focus();
  };
  
  /**
   * code
   * get the HTML contents of note or set the HTML contents of note.
   */
  $.fn.code = function(sHTML) {
    var info = renderer.layoutInfo(this);
    if (sHTML === undefined) {
      return info.editable.html();
    }
    info.editable.html(sHTML);
  };
  
  /**
   * finish
   */
  $.fn.destory = function() {
    renderer.removeLayout(this);
  };
});
