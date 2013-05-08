/**
 * w3cRange.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 *
 */
"use strict";
define('w3cRange', ['dom'], function(dom) {
  var Range = function(sc, so, ec, eo) {
    /**
     * nodes
     */
    this.nodes = function(bSplitText, pred) {
      return [];
    };
  };
  
  
  return {
    createFromNative: function() {
      return new Range();
    }
  };
});
