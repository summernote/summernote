// summernote.js
// (c) 2013~ Youngteac Hong
// summernote.js may be freely distributed under the MIT license.
(function(root) {
  /***********************************************
   * Base Functions (reduce, curry, compose, not)
   ***********************************************/
  /**
   * reduce
   * boils down a list of values into a single value. Known as inject, foldl
   */
  var reduce = function(array, iterator, memo, context) {
    var nomemo = arguments.length > 3;
    var index = -1, len = array.length;
    
    if (nomemo) { memo = array[++index] }
    while(++index < len) { memo = iterator(memo, array[index], index, array); }
    return memo;
  };
  
  /**
   * not
   * Produce not function
   */
  var not = function(pred) {
    return function() { !pred.apply(pred, arguments); };
  };
  
  /****************************************
   * List Utility
   ****************************************/
  var list = (function() {
    /**
     * return array's last item
     */
    var last = function(array) {
      return array[array.length - 1];
    };
    
    /**
     * tail
     * return the rest of items in an array.
     */
    var tail = function(array) {
      return array.slice(1);
    };

    /**
     * Sum each value in array through transformation(iterator) function
     */
    var sum = function(array, iterator) {
      return reduce(array, function(memo, item) {
        return memo + iterator(item);
      });
    }
    return {last: last, tail: tail, sum: sum};
  })();
  
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
      isText: isText, isNotText: not(isText),
      listPrev: listPrev
    }
  })();
  
  /****************************************
   * nativeRange (function)
   * from W3C Two BoundaryPoints to nativeRange
   * Support IE8+, Morden Webkit, Firefox
   ****************************************/
  var nativeRange = function(sc, so, ec, eo) {
    /**
     * bp2textRange
     * Single W3C boundaryPoint(cont, offset) to nativeRange
     */
    var bp2textRange = function(cont, offset) {
      var textRangeProp = function(cont, offset) {
        var node, collapseToStart;
        if (dom.isText(cont)) {
          var prevTexts = dom.listPrev(cont, dom.isNotText);
          var prevCont = list.last(prevTexts).previousSibling;
          node = prevCont || cont.parentNode;
          offset += list.sum(list.tail(prevTexts, dom.length));
          collapseToStart = !prevCont;
        } else {
          node = cont.childNodes[offset] || cont;
          if (dom.isText(node)) {
            return textRangeProp(node, offset);
          }
          offset = 0, collapseToStart = false;
        }
        return {node: node, collapseToStart: collapseToStart, offset: offset};
      }
      
      var textRange = document.body.createTextRange();
      var prop = textRangeProp(cont, offset);
      
      textRange.moveToElementText(prop.node);
      textRange.collapse(prop.collapseToStart);
      textRange.moveStart('character', prop.offset);
      return textRange;
    };

    // create native range
    var range;
    if (document.createRange) {
      range = document.createRange();
      range.setStart(sc, so);
      range.setEnd(ec, eo);
    } else {
      range = bp2textRange(sc, so);
      range.setEndPoint('EndToEnd', bp2textRange(ec, eo));
    }
    return range;
  };
  
  /****************************************
   * non-contentEditable Editor (Class)
   * summernote
   ****************************************/
  var Summernote = function(holder, options) {
    this.html = function() {

    };
    
    this.destory = function() {

    };
    // TODO: event, renderer
  };
  
  // External User Interface
  var summernote = {
    // User Interface
    create: function(holder, options) {
      return new Summernote(holder, options);
    },
    // For Test
    list: list,
    dom: dom,
    nativeRange: nativeRange
  };
  
  // AMD / RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define('summernote', [], function() {
      return summernote;
    });
  } else {
    root.summernote = summernote;
  }
})(this); // root object, window in the browser
