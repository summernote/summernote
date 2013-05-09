/**
 * w3cRange.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 *
 */
"use strict";
define('w3cRange', ['dom'], function(dom) {
  var Range = function(sc, so, ec, eo) {
    this.nodes = function(bSplitText, pred) {
      var aNodes = dom.listBetween(sc, ec);
      return aNodes;
    };
  };
  
  /**
   * createFromSelection
   */
  var createFromSelection = function() {
    if (document.getSelection) { //webkit
      var rng = document.getSelection().getRangeAt(0);
      return new Range(rng.startContainer, rng.startOffset,
                       rng.endContainer, rng.endOffset);
    }
  };
  
  return {
    createFromSelection: createFromSelection
  };
});
