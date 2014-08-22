define([
  'summernote/core/func',
  'summernote/core/list',
  'summernote/core/agent'
], function (func, list, agent) {
  /**
   * Dom functions
   */
  var dom = (function () {
    /**
     * returns whether node is `note-editable` or not.
     *
     * @param {Node} node
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

    var isText = function (node) {
      return node.nodeType === 3;
    };

    /**
     * ex) br, col, embed, hr, img, input, ...
     * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
     */
    var isVoid = function (node) {
      return node && (node.nodeName === 'BR' || node.nodeName === 'IMG');
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

    var isBodyContainer = function (node) {
      return isCell(node) || isEditable(node);
    };

    /**
     * returns whether node is textNode on bodyContainer or not.
     *
     * @param {Node} node
     */
    var isBodyText = function (node) {
      return dom.isText(node) && isBodyContainer(node.parentNode);
    };

    /**
     * blank HTML for cursor position
     */
    var blankHTML = agent.isMSIE ? '&nbsp;' : '<br>';

    /**
     * padding blankHTML if node is empty (for cursor position)
     */
    var paddingBlankHTML = function (node) {
      if (!isVoid(node) && !length(node)) {
        node.innerHTML = blankHTML;
      }
    };

    /**
     * find nearest ancestor predicate hit
     *
     * @param {Node} node
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
     * @param {Node} node
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
     * @param {Node} nodeA
     * @param {Node} nodeB
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
     * @param {Node} nodeA
     * @param {Node} nodeB
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
     * @param {Node} node
     * @param {Function} [optional] pred - predicate function
     */
    var listPrev = function (node, pred) {
      pred = pred || func.fail;

      var aNext = [];
      while (node) {
        if (pred(node)) { break; }
        aNext.push(node);
        node = node.previousSibling;
      }
      return aNext;
    };

    /**
     * listing next siblings (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [pred] - predicate function
     */
    var listNext = function (node, pred) {
      pred = pred || func.fail;

      var aNext = [];
      while (node) {
        if (pred(node)) { break; }
        aNext.push(node);
        node = node.nextSibling;
      }
      return aNext;
    };

    /**
     * listing descendant nodes
     *
     * @param {Node} node
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
     * wrap node with new tag.
     *
     * @param {Node} node
     * @param {Node} tagName of wrapper
     * @return {Node} - wrapper
     */
    var wrap = function (node, wrapperName) {
      var parent = node.parentNode;
      var wrapper = $('<' + wrapperName + '>')[0];

      parent.insertBefore(wrapper, node);
      wrapper.appendChild(node);

      return wrapper;
    };

    /**
     * insert node after preceding
     *
     * @param {Node} node
     * @param {Node} preceding - predicate function
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
     * @param {Node} node
     * @param {Collection} aChild
     */
    var appends = function (node, aChild) {
      $.each(aChild, function (idx, child) {
        node.appendChild(child);
      });
      return node;
    };

    /**
     * returns #text's text size or element's childNodes size
     *
     * @param {Node} node
     */
    var length = function (node) {
      if (isText(node)) { return node.nodeValue.length; }
      return node.childNodes.length;
    };

    var isLeftEdgeBP = function (boundaryPoint) {
      return boundaryPoint.offset === 0;
    };

    var isRightEdgeBP = function (boundaryPoint) {
      return boundaryPoint.offset === length(boundaryPoint.node);
    };

    /**
     * returns whether boundaryPoint is edge or not.
     *
     * @param {BoundaryPoint} boundaryPoitn
     * @return {Boolean}
     */
    var isEdgeBP = function (boundaryPoint) {
      return boundaryPoint.offset === 0 || isRightEdgeBP(boundaryPoint);
    };

    /**
     * returns whether node is right edge of ancestor or not.
     *
     * @param {Node} node
     * @param {Node} ancestor
     * @return {Boolean}
     */
    var isRightEdgeOf = function (node, ancestor) {
      while (node && node !== ancestor) {
        if (position(node) !== length(node.parentNode) - 1) {
          return false;
        }
        node = node.parentNode;
      }

      return true;
    };

    /**
     * returns offset from parent.
     *
     * @param {Node} node
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
     * @param {Node} ancestor - ancestor node
     * @param {Node} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var aAncestor = list.initial(listAncestor(node, func.eq(ancestor)));
      return $.map(aAncestor, position).reverse();
    };

    /**
     * return element from offsetPath(array of offset)
     *
     * @param {Node} ancestor - ancestor node
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
     * @param {BoundaryPoint} point
     * @return {Node} right node of boundaryPoint
     */
    var splitNode = function (point) {
      // split #text
      if (isText(point.node)) {
        // edge case
        if (isLeftEdgeBP(point)) {
          return point.node;
        } else if (isRightEdgeBP(point)) {
          return point.node.nextSibling;
        }

        return point.node.splitText(point.offset);
      }

      // split element
      var childNode = point.node.childNodes[point.offset];
      var clone = insertAfter(point.node.cloneNode(false), point.node);
      appends(clone, listNext(childNode));

      paddingBlankHTML(point.node);
      paddingBlankHTML(clone);

      return clone;
    };

    /**
     * split tree by point
     *
     * @param {Node} root - split root
     * @param {BoundaryPoint} point
     * @return {Node} right node of boundaryPoint
     */
    var splitTree = function (root, point) {
      // ex) [#text, <span>, <p>]
      var ancestors = listAncestor(point.node, func.eq(root));

      if (!ancestors.length) {
        return null;
      } else if (ancestors.length === 1) {
        return splitNode(point);
      }

      return ancestors.reduce(function (node, parent) {
        var clone = insertAfter(parent.cloneNode(false), parent);

        if (node === point.node) {
          node = splitNode(point);
        }

        appends(clone, listNext(node));

        paddingBlankHTML(parent);
        paddingBlankHTML(clone);
        return clone;
      });
    };

    /**
     * remove node, (bRemoveChild: remove child or not)
     * @param {Node} node
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
      blank: blankHTML,
      emptyPara: '<p><br/></p>',
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      buildLayoutInfo: buildLayoutInfo,
      isText: isText,
      isBodyText: isBodyText,
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
      isRightEdgeBP: isRightEdgeBP,
      isEdgeBP: isEdgeBP,
      isRightEdgeOf: isRightEdgeOf,
      prevBP: prevBP,
      ancestor: ancestor,
      listAncestor: listAncestor,
      listNext: listNext,
      listPrev: listPrev,
      listDescendant: listDescendant,
      commonAncestor: commonAncestor,
      listBetween: listBetween,
      wrap: wrap,
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
