define(['core/func', 'core/list', 'core/agent'], function (func, list, agent) {
  /**
   * dom utils
   */
  var dom = (function () {
    /**
     * returns predicate which judge whether nodeName is same
     */
    var makePredByNodeName = function (sNodeName) {
      // nodeName of element is always uppercase.
      return function (node) {
        return node && node.nodeName === sNodeName;
      };
    };
  
    var isPara = function (node) {
      // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
      return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName);
    };
  
    var isList = function (node) {
      return node && /^UL|^OL/.test(node.nodeName);
    };
  
    /**
     * returns whether node is `note-editable` or not.
     */
    var isEditable = function (node) {
      return node && $(node).hasClass('note-editable');
    };
  
    var isControlSizing = function (node) {
      return node && $(node).hasClass('note-control-sizing');
    };
  
    /**
     * find nearest ancestor predicate hit
     * @param {element} node
     * @param {function} pred - predicate function
     */
    var ancestor = function (node, pred) {
      while (node) {
        if (pred(node)) { return node; }
        if (isEditable(node)) { break; }

        node = node.parentNode;
      }
      return null;
    };
  
    /**
     * returns new array of ancestor nodes (until predicate hit).
     * @param {element} node
     * @param {function} [optional] pred - predicate function
     */
    var listAncestor = function (node, pred) {
      pred = pred || func.fail;
  
      var aAncestor = [];
      ancestor(node, function (el) {
        aAncestor.push(el);
        return pred(el);
      });
      return aAncestor;
    };
  
    /**
     * returns common ancestor node between two nodes.
     * @param {element} nodeA
     * @param {element} nodeB
     */
    var commonAncestor = function (nodeA, nodeB) {
      var aAncestor = listAncestor(nodeA);
      for (var n = nodeB; n; n = n.parentNode) {
        if ($.inArray(n, aAncestor) > -1) { return n; }
      }
      return null; // difference document area
    };
  
    /**
     * listing all Nodes between two nodes.
     * FIXME: nodeA and nodeB must be sorted, use comparePoints later.
     * @param {element} nodeA
     * @param {element} nodeB
     */
    var listBetween = function (nodeA, nodeB) {
      var aNode = [];
  
      var bStart = false, bEnd = false;
      var fnWalk = function (node) {
        if (!node) { return; } // traverse fisnish
        if (node === nodeA) { bStart = true; } // start point
        if (bStart && !bEnd) { aNode.push(node); } // between
        if (node === nodeB) { bEnd = true; return; } // end point
  
        for (var idx = 0, sz = node.childNodes.length; idx < sz; idx++) {
          fnWalk(node.childNodes[idx]);
        }
      };
  
      fnWalk(commonAncestor(nodeA, nodeB)); // DFS with commonAcestor.
      return aNode;
    };
  
    /**
     * listing all prevSiblings (until predicate hit).
     * @param {element} node
     * @param {function} [optional] pred - predicate function
     */
    var listPrev = function (node, pred) {
      pred = pred || func.fail;
  
      var aNext = [];
      while (node) {
        aNext.push(node);
        if (pred(node)) { break; }
        node = node.previousSibling;
      }
      return aNext;
    };
  
    /**
     * listing nextSiblings (until predicate hit).
     * @param {element} node
     * @param {function} pred [optional] - predicate function
     */
    var listNext = function (node, pred) {
      pred = pred || func.fail;
  
      var aNext = [];
      while (node) {
        aNext.push(node);
        if (pred(node)) { break; }
        node = node.nextSibling;
      }
      return aNext;
    };
  
    /**
     * insert node after preceding
     * @param {element} node
     * @param {element} preceding - predicate function
     */
    var insertAfter = function (node, preceding) {
      var next = preceding.nextSibling, parent = preceding.parentNode;
      if (next) {
        parent.insertBefore(node, next);
      } else {
        parent.appendChild(node);
      }
      return node;
    };
  
    /**
     * append children
     * @param {element} node
     * @param {collection} aChild
     */
    var appends = function (node, aChild) {
      $.each(aChild, function (idx, child) {
        node.appendChild(child);
      });
      return node;
    };
  
    var isText = makePredByNodeName('#text');
  
    /**
     * returns #text's text size or element's childNodes size
     * @param {element} node
     */
    var length = function (node) {
      if (isText(node)) { return node.nodeValue.length; }
      return node.childNodes.length;
    };
  
    /**
     * returns offset from parent.
     * @param {element} node
     */
    var position = function (node) {
      var offset = 0;
      while ((node = node.previousSibling)) { offset += 1; }
      return offset;
    };
  
    /**
     * return offsetPath(array of offset) from ancestor
     * @param {element} ancestor - ancestor node
     * @param {element} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var aAncestor = list.initial(listAncestor(node, func.eq(ancestor)));
      return $.map(aAncestor, position).reverse();
    };
  
    /**
     * return element from offsetPath(array of offset)
     * @param {element} ancestor - ancestor node
     * @param {array} aOffset - offsetPath
     */
    var fromOffsetPath = function (ancestor, aOffset) {
      var current = ancestor;
      for (var i = 0, sz = aOffset.length; i < sz; i++) {
        current = current.childNodes[aOffset[i]];
      }
      return current;
    };
  
    /**
     * split element or #text
     * @param {element} node
     * @param {number} offset
     */
    var splitData = function (node, offset) {
      if (offset === 0) { return node; }
      if (offset >= length(node)) { return node.nextSibling; }
  
      // splitText
      if (isText(node)) { return node.splitText(offset); }
  
      // splitElement
      var child = node.childNodes[offset];
      node = insertAfter(node.cloneNode(false), node);
      return appends(node, listNext(child));
    };
  
    /**
     * split dom tree by boundaryPoint(pivot and offset)
     * @param {element} root
     * @param {element} pivot - this will be boundaryPoint's node
     * @param {number} offset - this will be boundaryPoint's offset
     */
    var split = function (root, pivot, offset) {
      var aAncestor = listAncestor(pivot, func.eq(root));
      if (aAncestor.length === 1) { return splitData(pivot, offset); }
      return aAncestor.reduce(function (node, parent) {
        var clone = parent.cloneNode(false);
        insertAfter(clone, parent);
        if (node === pivot) {
          node = splitData(node, offset);
        }
        appends(clone, listNext(node));
        return clone;
      });
    };
  
    /**
     * remove node, (bRemoveChild: remove child or not)
     * @param {element} node
     * @param {boolean} bRemoveChild
     */
    var remove = function (node, bRemoveChild) {
      if (!node || !node.parentNode) { return; }
      if (node.removeNode) { return node.removeNode(bRemoveChild); }
  
      var elParent = node.parentNode;
      if (!bRemoveChild) {
        var aNode = [];
        var i, sz;
        for (i = 0, sz = node.childNodes.length; i < sz; i++) {
          aNode.push(node.childNodes[i]);
        }
  
        for (i = 0, sz = aNode.length; i < sz; i++) {
          elParent.insertBefore(aNode[i], node);
        }
      }
  
      elParent.removeChild(node);
    };
  
    var html = function ($node) {
      return dom.isTextarea($node[0]) ? $node.val() : $node.html();
    };
  
    return {
      blank: agent.bMSIE ? '&nbsp;' : '<br/>',
      emptyPara: '<p><br/></p>',
      isText: isText,
      isPara: isPara,
      isList: isList,
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      isAnchor: makePredByNodeName('A'),
      isDiv: makePredByNodeName('DIV'),
      isLi: makePredByNodeName('LI'),
      isSpan: makePredByNodeName('SPAN'),
      isB: makePredByNodeName('B'),
      isU: makePredByNodeName('U'),
      isS: makePredByNodeName('S'),
      isI: makePredByNodeName('I'),
      isImg: makePredByNodeName('IMG'),
      isTextarea: makePredByNodeName('TEXTAREA'),
      ancestor: ancestor,
      listAncestor: listAncestor,
      listNext: listNext,
      listPrev: listPrev,
      commonAncestor: commonAncestor,
      listBetween: listBetween,
      insertAfter: insertAfter,
      position: position,
      makeOffsetPath: makeOffsetPath,
      fromOffsetPath: fromOffsetPath,
      split: split,
      remove: remove,
      html: html
    };
  })();

  return dom;
});
