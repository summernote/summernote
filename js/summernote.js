/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
require.config({ paths: { "lodash": '../libs/lodash', } });
define('summernote', ['renderer', 'eventHandler'], function(renderer, eventHandler) {
  var $ = jQuery;
  
  /**
   * summernote 
   *
   * create Editor Layout and attach Key and Mouse Event
   */
  $.fn.summernote = function(options) {
    options = options || {};
    
    // createLayout
    renderer.createLayout(this, options.height);
    
    var info = renderer.layoutInfo(this);
    eventHandler.attach(info);
    
    if(options.focus) { info.editable.focus(); } // options focus
  };
  
  /**
   * code
   *
   * get the HTML contents of note or set the HTML contents of note.
   */
  $.fn.code = function(sHTML) {
    var info = renderer.layoutInfo(this);
    
    //get the HTML contents
    if (sHTML === undefined) {
      return info.editable.html();
    }
    
    // set the HTML contents
    info.editable.html(sHTML);
  };
  
  /**
   * finish
   */
  $.fn.destory = function() {
    var info = renderer.layoutInfo(this);
    eventHandler.dettach(info);
    renderer.removeLayout(this);
  };
});
