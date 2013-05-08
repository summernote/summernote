/****************************************
 * Dom Utility
 ****************************************/
var dom = (function() {
  /**
   * judge whether node is text node or not
   */
  var isText = function(node) {
    return node && node.nodeName === '#text';
  };

  /**
   * listPrev
   *
   * listing previous nodes (until predicate hit, optional)
   */
  var listPrev = function(node, pred) {
    pred = pred || function() { return false; };
    var nodes = [], prev = node;
    while (prev) {
      if (pred(prev)) { break; }
      nodes.push(prev); 
      prev = prev.previousSibling;
    } 
    return nodes;
  };

  return {
    isText: isText,
    listPrev: listPrev
  }
})();
