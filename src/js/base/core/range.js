import $ from 'jquery';
import env from './env';
import * as func from './func';
import { Lists } from './lists';
import { BoundaryPoints, EMPTY_PARA, Nodes } from './dom';

/**
 * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
 *
 * @param {TextRange} textRange
 * @param {Boolean} isStart
 * @return {BoundaryPoint}
 *
 * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
 */
function textRangeToPoint(textRange, isStart) {
  let container = textRange.parentElement();
  let offset;

  const tester = document.body.createTextRange();
  let prevContainer;
  const childNodes = Lists.from(container.childNodes);
  for (offset = 0; offset < childNodes.length; offset++) {
    if (Nodes.isText(childNodes[offset])) {
      continue;
    }
    tester.moveToElementText(childNodes[offset]);
    if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
      break;
    }
    prevContainer = childNodes[offset];
  }

  if (offset !== 0 && Nodes.isText(childNodes[offset - 1])) {
    const textRangeStart = document.body.createTextRange();
    let curTextNode = null;
    textRangeStart.moveToElementText(prevContainer || container);
    textRangeStart.collapse(!prevContainer);
    curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;

    const pointTester = textRange.duplicate();
    pointTester.setEndPoint('StartToStart', textRangeStart);
    let textCount = pointTester.text.replace(/[\r\n]/g, '').length;

    while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    }

    // [workaround] enforce IE to re-reference curTextNode, hack
    const dummy = curTextNode.nodeValue; // eslint-disable-line

    if (isStart && curTextNode.nextSibling && Nodes.isText(curTextNode.nextSibling) &&
      textCount === curTextNode.nodeValue.length) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    }

    container = curTextNode;
    offset = textCount;
  }

  return {
    cont: container,
    offset: offset,
  };
}

/**
 * return TextRange from boundary point (inspired by google closure-library)
 * @param {BoundaryPoint} point
 * @return {TextRange}
 */
function pointToTextRange(point) {
  const textRangeInfo = function(container, offset) {
    let node, isCollapseToStart;

    if (Nodes.isText(container)) {
      const prevTextNodes = Nodes.listPrev(container, func.not(Nodes.isText));
      const prevContainer = Lists.last(prevTextNodes).previousSibling;
      node = prevContainer || container.parentNode;
      offset += Lists.sum(Lists.tail(prevTextNodes), Nodes.nodeLength);
      isCollapseToStart = !prevContainer;
    } else {
      node = container.childNodes[offset] || container;
      if (Nodes.isText(node)) {
        return textRangeInfo(node, 0);
      }

      offset = 0;
      isCollapseToStart = false;
    }

    return {
      node: node,
      collapseToStart: isCollapseToStart,
      offset: offset,
    };
  };

  const textRange = document.body.createTextRange();
  const info = textRangeInfo(point.node, point.offset);

  textRange.moveToElementText(info.node);
  textRange.collapse(info.collapseToStart);
  textRange.moveStart('character', info.offset);
  return textRange;
}

/**
   * Wrapped Range
   *
   * @constructor
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   */
class WrappedRange {
  constructor(sc, so, ec, eo) {
    this.sc = sc;
    this.so = so;
    this.ec = ec;
    this.eo = eo;

    // isOnEditable: judge whether range is on editable or not
    this.isOnEditable = this.makeIsOn(Nodes.isEditable);
    // isOnList: judge whether range is on list node or not
    this.isOnList = this.makeIsOn(Nodes.isList);
    // isOnAnchor: judge whether range is on anchor node or not
    this.isOnAnchor = this.makeIsOn(Nodes.isAnchor);
    // isOnCell: judge whether range is on cell node or not
    this.isOnCell = this.makeIsOn(Nodes.isCell);
    // isOnData: judge whether range is on data node or not
    this.isOnData = this.makeIsOn(Nodes.isData);
  }

  // nativeRange: get nativeRange from sc, so, ec, eo
  nativeRange() {
    if (env.isW3CRangeSupport) {
      const w3cRange = document.createRange();
      w3cRange.setStart(this.sc, this.so);
      w3cRange.setEnd(this.ec, this.eo);

      return w3cRange;
    } else {
      const textRange = pointToTextRange({
        node: this.sc,
        offset: this.so,
      });

      textRange.setEndPoint('EndToEnd', pointToTextRange({
        node: this.ec,
        offset: this.eo,
      }));

      return textRange;
    }
  }

  getPoints() {
    return {
      sc: this.sc,
      so: this.so,
      ec: this.ec,
      eo: this.eo,
    };
  }

  getStartPoint() {
    return {
      node: this.sc,
      offset: this.so,
    };
  }

  getEndPoint() {
    return {
      node: this.ec,
      offset: this.eo,
    };
  }

  /**
   * select update visible range
   */
  select() {
    const nativeRng = this.nativeRange();
    if (env.isW3CRangeSupport) {
      const selection = document.getSelection();
      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }
      selection.addRange(nativeRng);
    } else {
      nativeRng.select();
    }

    return this;
  }

  /**
   * Moves the scrollbar to start container(sc) of current range
   *
   * @return {WrappedRange}
   */
  scrollIntoView(container) {
    const height = $(container).height();
    if (container.scrollTop + height < this.sc.offsetTop) {
      container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
    }

    return this;
  }

  /**
   * @return {WrappedRange}
   */
  normalize() {
    /**
     * @param {BoundaryPoint} point
     * @param {Boolean} isLeftToRight
     * @return {BoundaryPoint}
     */
    const getVisiblePoint = function(point, isLeftToRight) {
      if ((BoundaryPoints.isVisiblePoint(point) && !BoundaryPoints.isEdgePoint(point)) ||
          (BoundaryPoints.isVisiblePoint(point) && BoundaryPoints.isRightEdgePoint(point) && !isLeftToRight) ||
          (BoundaryPoints.isVisiblePoint(point) && BoundaryPoints.isLeftEdgePoint(point) && isLeftToRight) ||
          (BoundaryPoints.isVisiblePoint(point) && Nodes.isBlock(point.node) && Nodes.isEmpty(point.node))) {
        return point;
      }

      // point on block's edge
      const block = Nodes.ancestor(point.node, Nodes.isBlock);
      if (((BoundaryPoints.isLeftEdgePointOf(point, block) || Nodes.isVoid(BoundaryPoints.prevPoint(point).node)) && !isLeftToRight) ||
          ((BoundaryPoints.isRightEdgePointOf(point, block) || Nodes.isVoid(BoundaryPoints.nextPoint(point).node)) && isLeftToRight)) {
        // returns point already on visible point
        if (BoundaryPoints.isVisiblePoint(point)) {
          return point;
        }
        // reverse direction
        isLeftToRight = !isLeftToRight;
      }

      const nextPoint = isLeftToRight ? BoundaryPoints.nextPointUntil(BoundaryPoints.nextPoint(point), BoundaryPoints.isVisiblePoint)
        : BoundaryPoints.prevPointUntil(BoundaryPoints.prevPoint(point), BoundaryPoints.isVisiblePoint);
      return nextPoint || point;
    };

    const endPoint = getVisiblePoint(this.getEndPoint(), false);
    const startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);

    return new WrappedRange(
      startPoint.node,
      startPoint.offset,
      endPoint.node,
      endPoint.offset
    );
  }

  /**
   * returns matched nodes on range
   *
   * @param {Function} [pred] - predicate function
   * @param {Object} [options]
   * @param {Boolean} [options.includeAncestor]
   * @param {Boolean} [options.fullyContains]
   * @return {Node[]}
   */
  nodes(pred, options) {
    pred = pred || func.ok;

    const includeAncestor = options && options.includeAncestor;
    const fullyContains = options && options.fullyContains;

    // TODO compare points and sort
    const startPoint = this.getStartPoint();
    const endPoint = this.getEndPoint();

    const nodes = [];
    const leftEdgeNodes = [];

    BoundaryPoints.walkPoint(startPoint, endPoint, function(point) {
      if (Nodes.isEditable(point.node)) {
        return;
      }

      let node;
      if (fullyContains) {
        if (BoundaryPoints.isLeftEdgePoint(point)) {
          leftEdgeNodes.push(point.node);
        }
        if (BoundaryPoints.isRightEdgePoint(point) && Lists.contains(leftEdgeNodes, point.node)) {
          node = point.node;
        }
      } else if (includeAncestor) {
        node = Nodes.ancestor(point.node, pred);
      } else {
        node = point.node;
      }

      if (node && pred(node)) {
        nodes.push(node);
      }
    }, true);

    return Lists.unique(nodes);
  }

  /**
   * returns commonAncestor of range
   * @return {Element} - commonAncestor
   */
  commonAncestor() {
    return Nodes.commonAncestor(this.sc, this.ec);
  }

  /**
   * returns expanded range by pred
   *
   * @param {Function} pred - predicate function
   * @return {WrappedRange}
   */
  expand(pred) {
    const startAncestor = Nodes.ancestor(this.sc, pred);
    const endAncestor = Nodes.ancestor(this.ec, pred);

    if (!startAncestor && !endAncestor) {
      return new WrappedRange(this.sc, this.so, this.ec, this.eo);
    }

    const boundaryPoints = this.getPoints();

    if (startAncestor) {
      boundaryPoints.sc = startAncestor;
      boundaryPoints.so = 0;
    }

    if (endAncestor) {
      boundaryPoints.ec = endAncestor;
      boundaryPoints.eo = Nodes.nodeLength(endAncestor);
    }

    return new WrappedRange(
      boundaryPoints.sc,
      boundaryPoints.so,
      boundaryPoints.ec,
      boundaryPoints.eo
    );
  }

  /**
   * @param {Boolean} isCollapseToStart
   * @return {WrappedRange}
   */
  collapse(isCollapseToStart) {
    if (isCollapseToStart) {
      return new WrappedRange(this.sc, this.so, this.sc, this.so);
    } else {
      return new WrappedRange(this.ec, this.eo, this.ec, this.eo);
    }
  }

  /**
   * splitText on range
   */
  splitText() {
    const isSameContainer = this.sc === this.ec;
    const boundaryPoints = this.getPoints();

    if (Nodes.isText(this.ec) && !BoundaryPoints.isEdgePoint(this.getEndPoint())) {
      this.ec.splitText(this.eo);
    }

    if (Nodes.isText(this.sc) && !BoundaryPoints.isEdgePoint(this.getStartPoint())) {
      boundaryPoints.sc = this.sc.splitText(this.so);
      boundaryPoints.so = 0;

      if (isSameContainer) {
        boundaryPoints.ec = boundaryPoints.sc;
        boundaryPoints.eo = this.eo - this.so;
      }
    }

    return new WrappedRange(
      boundaryPoints.sc,
      boundaryPoints.so,
      boundaryPoints.ec,
      boundaryPoints.eo
    );
  }

  /**
   * delete contents on range
   * @return {WrappedRange}
   */
  deleteContents() {
    if (this.isCollapsed()) {
      return this;
    }

    const rng = this.splitText();
    const nodes = rng.nodes(null, {
      fullyContains: true,
    });

    // find new cursor point
    const point = BoundaryPoints.prevPointUntil(rng.getStartPoint(), function(point) {
      return !Lists.contains(nodes, point.node);
    });

    const emptyParents = [];
    $.each(nodes, function(idx, node) {
      // find empty parents
      const parent = node.parentNode;
      if (point.node !== parent && Nodes.nodeLength(parent) === 1) {
        emptyParents.push(parent);
      }
      Nodes.remove(node, false);
    });

    // remove empty parents
    $.each(emptyParents, function(idx, node) {
      Nodes.remove(node, false);
    });

    return new WrappedRange(
      point.node,
      point.offset,
      point.node,
      point.offset
    ).normalize();
  }

  /**
   * makeIsOn: return isOn(pred) function
   */
  makeIsOn(pred) {
    return function() {
      const ancestor = Nodes.ancestor(this.sc, pred);
      return !!ancestor && (ancestor === Nodes.ancestor(this.ec, pred));
    };
  }

  /**
   * @param {Function} pred
   * @return {Boolean}
   */
  isLeftEdgeOf(pred) {
    if (!BoundaryPoints.isLeftEdgePoint(this.getStartPoint())) {
      return false;
    }

    const node = Nodes.ancestor(this.sc, pred);
    return node && Nodes.isLeftEdgeOf(this.sc, node);
  }

  /**
   * returns whether range was collapsed or not
   */
  isCollapsed() {
    return this.sc === this.ec && this.so === this.eo;
  }

  /**
   * wrap inline nodes which children of body with paragraph
   *
   * @return {WrappedRange}
   */
  wrapBodyInlineWithPara() {
    if (Nodes.isBodyContainer(this.sc) && Nodes.isEmpty(this.sc)) {
      this.sc.innerHTML = EMPTY_PARA;
      return new WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
    }

    /**
     * [workaround] firefox often create range on not visible point. so normalize here.
     *  - firefox: |<p>text</p>|
     *  - chrome: <p>|text|</p>
     */
    const rng = this.normalize();
    if (Nodes.isParaInline(this.sc) || Nodes.isPara(this.sc)) {
      return rng;
    }

    // find inline top ancestor
    let topAncestor;
    if (Nodes.isInline(rng.sc)) {
      const ancestors = Nodes.listAncestor(rng.sc, func.not(Nodes.isInline));
      topAncestor = Lists.last(ancestors);
      if (!Nodes.isInline(topAncestor)) {
        topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
      }
    } else {
      topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
    }

    // siblings not in paragraph
    let inlineSiblings = Nodes.listPrev(topAncestor, Nodes.isParaInline).reverse();
    inlineSiblings = inlineSiblings.concat(Nodes.listNext(topAncestor.nextSibling, Nodes.isParaInline));

    // wrap with paragraph
    if (inlineSiblings.length) {
      const para = Nodes.wrap(Lists.head(inlineSiblings), 'p');
      Nodes.appendChildNodes(para, Lists.tail(inlineSiblings));
    }

    return this.normalize();
  }

  /**
   * insert node at current cursor
   *
   * @param {Node} node
   * @return {Node}
   */
  insertNode(node) {
    const rng = this.wrapBodyInlineWithPara().deleteContents();
    const info = BoundaryPoints.splitPoint(rng.getStartPoint(), Nodes.isInline(node));

    if (info.rightNode) {
      info.rightNode.parentNode.insertBefore(node, info.rightNode);
    } else {
      info.container.appendChild(node);
    }

    return node;
  }

  /**
   * insert html at current cursor
   */
  pasteHTML(markup) {
    const contentsContainer = $('<div></div>').html(markup)[0];
    let childNodes = Lists.from(contentsContainer.childNodes);
    const rng = this.wrapBodyInlineWithPara().deleteContents();

    if (rng.so > 0) {
      childNodes = childNodes.reverse();
    }
    childNodes = childNodes.map(function(childNode) {
      return rng.insertNode(childNode);
    });
    if (rng.so > 0) {
      childNodes = childNodes.reverse();
    }
    return childNodes;
  }

  /**
   * returns text in range
   *
   * @return {String}
   */
  toString() {
    const nativeRng = this.nativeRange();
    return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
  }

  /**
   * returns range for word before cursor
   *
   * @param {Boolean} [findAfter] - find after cursor, default: false
   * @return {WrappedRange}
   */
  getWordRange(findAfter) {
    let endPoint = this.getEndPoint();

    if (!BoundaryPoints.isCharPoint(endPoint)) {
      return this;
    }

    const startPoint = BoundaryPoints.prevPointUntil(endPoint, function(point) {
      return !BoundaryPoints.isCharPoint(point);
    });

    if (findAfter) {
      endPoint = BoundaryPoints.nextPointUntil(endPoint, function(point) {
        return !BoundaryPoints.isCharPoint(point);
      });
    }

    return new WrappedRange(
      startPoint.node,
      startPoint.offset,
      endPoint.node,
      endPoint.offset
    );
  }

  /**
   * create offsetPath bookmark
   *
   * @param {Node} editable
   */
  bookmark(editable) {
    return {
      s: {
        path: Nodes.makeOffsetPath(editable, this.sc),
        offset: this.so,
      },
      e: {
        path: Nodes.makeOffsetPath(editable, this.ec),
        offset: this.eo,
      },
    };
  }

  /**
   * create offsetPath bookmark base on paragraph
   *
   * @param {Node[]} paras
   */
  paraBookmark(paras) {
    return {
      s: {
        path: Lists.tail(Nodes.makeOffsetPath(Lists.head(paras), this.sc)),
        offset: this.so,
      },
      e: {
        path: Lists.tail(Nodes.makeOffsetPath(Lists.last(paras), this.ec)),
        offset: this.eo,
      },
    };
  }

  /**
   * getClientRects
   * @return {Rect[]}
   */
  getClientRects() {
    const nativeRng = this.nativeRange();
    return nativeRng.getClientRects();
  }
}

/**
 * Data structure
 *  * BoundaryPoint: a point of dom tree
 *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
 *
 * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
 */
export default {
  /**
   * create Range Object From arguments or Browser Selection
   *
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   * @return {WrappedRange}
   */
  create: function(sc, so, ec, eo) {
    if (arguments.length === 4) {
      return new WrappedRange(sc, so, ec, eo);
    } else if (arguments.length === 2) { // collapsed
      ec = sc;
      eo = so;
      return new WrappedRange(sc, so, ec, eo);
    } else {
      let wrappedRange = this.createFromSelection();
      if (!wrappedRange && arguments.length === 1) {
        wrappedRange = this.createFromNode(arguments[0]);
        return wrappedRange.collapse(EMPTY_PARA === arguments[0].innerHTML);
      }
      return wrappedRange;
    }
  },

  createFromSelection: function() {
    let sc, so, ec, eo;
    if (env.isW3CRangeSupport) {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return null;
      } else if (Nodes.isBody(selection.anchorNode)) {
        // Firefox: returns entire body as range on initialization.
        // We won't never need it.
        return null;
      }

      const nativeRng = selection.getRangeAt(0);
      sc = nativeRng.startContainer;
      so = nativeRng.startOffset;
      ec = nativeRng.endContainer;
      eo = nativeRng.endOffset;
    } else { // IE8: TextRange
      const textRange = document.selection.createRange();
      const textRangeEnd = textRange.duplicate();
      textRangeEnd.collapse(false);
      const textRangeStart = textRange;
      textRangeStart.collapse(true);

      let startPoint = textRangeToPoint(textRangeStart, true);
      let endPoint = textRangeToPoint(textRangeEnd, false);

      // same visible point case: range was collapsed.
      if (Nodes.isText(startPoint.node) && Nodes.isLeftEdgePoint(startPoint) &&
          Nodes.isTextNode(endPoint.node) && Nodes.isRightEdgePoint(endPoint) &&
          endPoint.node.nextSibling === startPoint.node) {
        startPoint = endPoint;
      }

      sc = startPoint.cont;
      so = startPoint.offset;
      ec = endPoint.cont;
      eo = endPoint.offset;
    }

    return new WrappedRange(sc, so, ec, eo);
  },

  /**
   * @method
   *
   * create WrappedRange from node
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNode: function(node) {
    let sc = node;
    let so = 0;
    let ec = node;
    let eo = Nodes.nodeLength(ec);

    // browsers can't target a picture or void node
    if (Nodes.isVoid(sc)) {
      so = Nodes.listPrev(sc).length - 1;
      sc = sc.parentNode;
    }
    if (Nodes.isBR(ec)) {
      eo = Nodes.listPrev(ec).length - 1;
      ec = ec.parentNode;
    } else if (Nodes.isVoid(ec)) {
      eo = Nodes.listPrev(ec).length;
      ec = ec.parentNode;
    }

    return this.create(sc, so, ec, eo);
  },

  /**
   * create WrappedRange from node after position
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNodeBefore: function(node) {
    return this.createFromNode(node).collapse(true);
  },

  /**
   * create WrappedRange from node after position
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNodeAfter: function(node) {
    return this.createFromNode(node).collapse();
  },

  /**
   * @method
   *
   * create WrappedRange from bookmark
   *
   * @param {Node} editable
   * @param {Object} bookmark
   * @return {WrappedRange}
   */
  createFromBookmark: function(editable, bookmark) {
    const sc = Nodes.fromOffsetPath(editable, bookmark.s.path);
    const so = bookmark.s.offset;
    const ec = Nodes.fromOffsetPath(editable, bookmark.e.path);
    const eo = bookmark.e.offset;
    return new WrappedRange(sc, so, ec, eo);
  },

  /**
   * @method
   *
   * create WrappedRange from paraBookmark
   *
   * @param {Object} bookmark
   * @param {Node[]} paras
   * @return {WrappedRange}
   */
  createFromParaBookmark: function(bookmark, paras) {
    const so = bookmark.s.offset;
    const eo = bookmark.e.offset;
    const sc = Nodes.fromOffsetPath(Lists.head(paras), bookmark.s.path);
    const ec = Nodes.fromOffsetPath(Lists.last(paras), bookmark.e.path);

    return new WrappedRange(sc, so, ec, eo);
  },
};
