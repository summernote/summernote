define(['summernote/core/func', 'summernote/core/list', 'summernote/core/agent'], function (func, list, agent) {
  /**
   * Dom functions
   */
  var dom = (function () {
    /**
     * returns whether node is `note-editable` or not.
     *
     * @param {Element} node
     * @return {Boolean}
     */
    var isEditable = function (node) {
      return node && $(node).hasClass('note-editable');
    };
  
    var isControlSizing = function (node) {
      return node && $(node).hasClass('note-control-sizing');
    };

    /**
     * build layoutInfo from $editor(.note-editor)
     *
     * @param {jQuery} $editor
     * @return {Object}
     */
    var buildLayoutInfo = function ($editor) {
      var makeFinder;

      // air mode
      if ($editor.hasClass('note-air-editor')) {
        var id = list.last($editor.attr('id').split('-'));
        makeFinder = function (sIdPrefix) {
          return function () { return $(sIdPrefix + id); };
        };

        return {
          editor: function () { return $editor; },
          editable: function () { return $editor; },
          popover: makeFinder('#note-popover-'),
          handle: makeFinder('#note-handle-'),
          dialog: makeFinder('#note-dialog-')
        };

      // frame mode
      } else {
        makeFinder = function (sClassName) {
          return function () { return $editor.find(sClassName); };
        };
        return {
          editor: function () { return $editor; },
          dropzone: makeFinder('.note-dropzone'),
          toolbar: makeFinder('.note-toolbar'),
          editable: makeFinder('.note-editable'),
          codable: makeFinder('.note-codable'),
          statusbar: makeFinder('.note-statusbar'),
          popover: makeFinder('.note-popover'),
          handle: makeFinder('.note-handle'),
          dialog: makeFinder('.note-dialog')
        };
      }
    };

    /**
     * returns predicate which judge whether nodeName is same
     * @param {String} sNodeName
     */
    var makePredByNodeName = function (sNodeName) {
      // nodeName is always uppercase.
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

    var isCell = function (node) {
      return node && /^TD|^TH/.test(node.nodeName);
    };
  
    /**
     * find nearest ancestor predicate hit
     *
     * @param {Element} node
     * @param {Function} pred - predicate function
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
     *
     * @param {Element} node
     * @param {Function} [optional] pred - predicate function
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
     *
     * @param {Element} nodeA
     * @param {Element} nodeB
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
     *
     * @param {Element} nodeA
     * @param {Element} nodeB
     */
    var listBetween = function (nodeA, nodeB) {
      var aNode = [];
  
      var isStart = false, isEnd = false;

      // DFS(depth first search) with commonAcestor.
      (function fnWalk(node) {
        if (!node) { return; } // traverse fisnish
        if (node === nodeA) { isStart = true; } // start point
        if (isStart && !isEnd) { aNode.push(node); } // between
        if (node === nodeB) { isEnd = true; return; } // end point

        for (var idx = 0, sz = node.childNodes.length; idx < sz; idx++) {
          fnWalk(node.childNodes[idx]);
        }
      })(commonAncestor(nodeA, nodeB));
  
      return aNode;
    };
  
    /**
     * listing all previous siblings (until predicate hit).
     * @param {Element} node
     * @param {Function} [optional] pred - predicate function
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
     * listing next siblings (until predicate hit).
     *
     * @param {Element} node
     * @param {Function} [pred] - predicate function
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
     * listing descendant nodes
     *
     * @param {Element} node
     * @param {Function} [pred] - predicate function
     */
    var listDescendant = function (node, pred) {
      var aDescendant = [];
      pred = pred || func.ok;

      // start DFS(depth first search) with node
      (function fnWalk(current) {
        if (node !== current && pred(current)) {
          aDescendant.push(current);
        }
        for (var idx = 0, sz = current.childNodes.length; idx < sz; idx++) {
          fnWalk(current.childNodes[idx]);
        }
      })(node);

      return aDescendant;
    };
  
    /**
     * insert node after preceding
     *
     * @param {Element} node
     * @param {Element} preceding - predicate function
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
     * append elements.
     *
     * @param {Element} node
     * @param {Collection} aChild
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
     *
     * @param {Element} node
     */
    var length = function (node) {
      if (isText(node)) { return node.nodeValue.length; }
      return node.childNodes.length;
    };

    /**
     * returns whether boundaryPoint is edge or not.
     *
     * @param {BoundaryPoint} boundaryPoitn
     * @return {Boolean}
     */
    var isEdgeBP = function (boundaryPoint) {
      return boundaryPoint.offset === 0 ||
             boundaryPoint.offset === length(boundaryPoint.node);
    };

    /**
     * returns offset from parent.
     *
     * @param {Element} node
     */
    var position = function (node) {
      var offset = 0;
      while ((node = node.previousSibling)) { offset += 1; }
      return offset;
    };

    var hasChildren = function (node) {
      return node && node.childNodes && node.childNodes.length;
    };

    /**
     * returns previous boundaryPoint
     *
     * @param {BoundaryPoint} boundaryPoitn
     * @return {BoundaryPoint}
     */
    var prevBP = function (boundaryPoint) {
      var node = boundaryPoint.node,
          offset = boundaryPoint.offset;

      if (offset === 0) {
        if (isEditable(node)) { return null; }
        return {node: node.parentNode, offset: position(node)};
      } else {
        if (hasChildren(node)) {
          var child = node.childNodes[offset - 1];
          return {node: child, offset: length(child)};
        } else {
          return {node: node, offset: offset - 1};
        }
      }
    };
  
    /**
     * return offsetPath(array of offset) from ancestor
     *
     * @param {Element} ancestor - ancestor node
     * @param {Element} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var aAncestor = list.initial(listAncestor(node, func.eq(ancestor)));
      return $.map(aAncestor, position).reverse();
    };
  
    /**
     * return element from offsetPath(array of offset)
     *
     * @param {Element} ancestor - ancestor node
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
     *
     * @param {Element} node
     * @param {Number} offset
     */
    var split = function (node, offset) {
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
     *
     * @param {Element} root
     * @param {Element} pivot - this will be boundaryPoint's node
     * @param {Number} offset - this will be boundaryPoint's offset
     */
    var splitTree = function (root, pivot, offset) {
      var aAncestor = listAncestor(pivot, func.eq(root));
      if (aAncestor.length === 1) { return split(pivot, offset); }
      return aAncestor.reduce(function (node, parent) {
        var clone = parent.cloneNode(false);
        insertAfter(clone, parent);
        if (node === pivot) {
          node = split(node, offset);
        }
        appends(clone, listNext(node));
        return clone;
      });
    };

    /**
     * remove node, (bRemoveChild: remove child or not)
     * @param {Element} node
     * @param {Boolean} bRemoveChild
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
      blank: agent.isMSIE ? '&nbsp;' : '<br/>',
      emptyPara: '<p><br/></p>',
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      buildLayoutInfo: buildLayoutInfo,
      isText: isText,
      isPara: isPara,
      isList: isList,
      isTable: makePredByNodeName('TABLE'),
      isCell: isCell,
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
      length: length,
      isEdgeBP: isEdgeBP,
      prevBP: prevBP,
      ancestor: ancestor,
      listAncestor: listAncestor,
      listNext: listNext,
      listPrev: listPrev,
      listDescendant: listDescendant,
      commonAncestor: commonAncestor,
      listBetween: listBetween,
      insertAfter: insertAfter,
      position: position,
      makeOffsetPath: makeOffsetPath,
      fromOffsetPath: fromOffsetPath,
      splitTree: splitTree,
      remove: remove,
      html: html
    };
  })();

  return dom;
});
