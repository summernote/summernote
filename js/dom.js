/**
 * dom.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 *
 */
"use strict";
define('dom', [], function() {
  /**
   * judge whether node is text node or not
   */
  var isText = function(node) {
    return node && node.nodeName === '#text';
  };
  
  /**
   * judge whether node is B or not
   */
  var isB = function(node) {
    return node && node.nodeName === "B";
  };
  
  /**
   * judge whether node is U or not
   */
  var isU = function(node) {
    return node && node.nodeName === "U";
  };
  
  /**
   * judge whether node is DIV or not
   */
  var isDiv = function(node) {
    return node && node.nodeName === "DIV";
  };
  
  /**
   * ancestor
   *
   * find nearest ancestor predicate hit
   */
  var ancestor = function(node, pred) {
    while (node) {
      if(pred(node)) { return node; }
      node = node.parentNode;
    }
    return null;
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
  
  /**
   * listBetween
   *
   * listing nodes between nodeA and nodeB (predicate, optional)
   */
  var listBetween = function(nodeA, nodeB, pred) {
    return [];
  };

  return {
    //preds
    isText: isText,
    isB: isB,
    isU: isU,
    isDiv: isDiv,
    
    //finds
    ancestor: ancestor,

    //lists
    listPrev: listPrev,
    listBetween: listBetween
  }
});
