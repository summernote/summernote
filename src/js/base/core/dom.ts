import $ from 'jquery';
import * as func from './func';
import { Lists } from './lists';
import env from './env';

export const NBSP_CHAR = String.fromCharCode(160);
export const ZERO_WIDTH_NBSP_CHAR = '\ufeff';

/**
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 */

export const BLANK_HTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';
export const EMPTY_PARA = `<p>${BLANK_HTML}</p>`;

export interface BoundaryPoint {
  node: Node;
  offset: number;
}

export class Nodes {
  /**
   * returns whether node is `note-editable` or not.
   */
  public static isEditable(node: Node): boolean {
    return node && $(node).hasClass('note-editable');
  }

  /**
   * returns whether node is `note-control-sizing` or not.
   */
  public static isControlSizing(node: Node): boolean {
    return node && $(node).hasClass('note-control-sizing');
  }

  /**
   * returns predicate which judge whether nodeName is same
   */
  public static makePredByNodeName(nodeName: string): (Node) => boolean {
    nodeName = nodeName.toUpperCase();
    return (node) => node && node.nodeName.toUpperCase() === nodeName;
  }

  /**
   * returns whether the node is text type(3) or not.
   */
  public static isText(node: Node): boolean {
    return node && node.nodeType === 3;
  }

  /**
   * returns whether the node is element type(1) or not.
   */
  public static isElement(node: Node): boolean {
    return node && node.nodeType === 1;
  }

  /**
   * returns whether the node is void element or not.
   * ex) br, col, embed, hr, img, input, ...
   * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
   */
  public static isVoid(node: Node): boolean {
    return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
  }

  public static isPara(node: Node): boolean {
    if (Nodes.isEditable(node)) {
      return false;
    }

    // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
    return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
  }

  public static isHeading(node): boolean {
    return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
  }

  public static isPre(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'PRE';
  }

  public static isLi(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'LI';
  }

  public static isPurePara(node: Node): boolean {
    return Nodes.isPara(node) && !Nodes.isLi(node);
  }

  public static isTable(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'TABLE';
  }

  public static isData(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'DATA';
  }

  public static isInline(node: Node): boolean {
    return !Nodes.isBodyContainer(node) &&
      !Nodes.isList(node) &&
      !Nodes.isHr(node) &&
      !Nodes.isPara(node) &&
      !Nodes.isTable(node) &&
      !Nodes.isBlockquote(node) &&
      !Nodes.isData(node);
  }

  public static isBlock(node: Node): boolean {
    return !Nodes.isInline(node);
  }

  public static isList(node: Node): boolean {
    return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
  }

  public static isHr(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'HR';
  }

  public static isCell(node: Node): boolean {
    return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
  }

  public static isBlockquote(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'BLOCKQUOTE';
  }

  public static isBodyContainer(node: Node): boolean {
    return Nodes.isCell(node) || Nodes.isBlockquote(node) || Nodes.isEditable(node);
  }

  public static isAnchor(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'A';
  }

  public static isDiv(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'DIV';
  }

  public static isBR(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'BR';
  }

  public static isSpan(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'SPAN';
  }

  public static isB(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'B';
  }

  public static isU(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'U';
  }

  public static isS(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'S';
  }

  public static isI(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'I';
  }

  public static isImg(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'IMG';
  }

  public static isTextarea(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'TEXTAREA';
  }

  public static isParaInline(node: Node): boolean {
    return Nodes.isInline(node) && !!Nodes.ancestor(node, Nodes.isPara);
  }

  public static isBodyInline(node: Node): boolean {
    return Nodes.isInline(node) && !Nodes.ancestor(node, Nodes.isPara);
  }

  public static isBody(node: Node): boolean {
    return node && node.nodeName.toUpperCase() === 'BODY';
  }

  /**
   * returns whether nodeB is closest sibling of nodeA
   */
  public static isClosestSibling(nodeA, nodeB): boolean {
    return nodeA.nextSibling === nodeB ||
      nodeA.previousSibling === nodeB;
  }

  /**
   * returns array of closest siblings with node
   */
  public static withClosestSiblings(
    node: Node, pred?: (Node) => boolean
  ): Array<Node> {
    pred = pred || func.ok;

    const siblings = [];
    if (node.previousSibling && pred(node.previousSibling)) {
      siblings.push(node.previousSibling);
    }
    siblings.push(node);
    if (node.nextSibling && pred(node.nextSibling)) {
      siblings.push(node.nextSibling);
    }
    return siblings;
  }

  /**
   * returns #text's text size or element's childNodes size
   */
  public static nodeLength(node: Node): number {
    if (Nodes.isText(node)) {
      return node.nodeValue.length;
    }

    if (node) {
      return node.childNodes.length;
    }

    return 0;
  }

  /**
   * returns whether node is empty or not.
   */
  public static isEmpty(node: Node): boolean {
    const len = Nodes.nodeLength(node);

    if (len === 0) {
      return true;
    }

    if (!Nodes.isText(node) &&
        len === 1 &&
        (node as HTMLElement).innerHTML === BLANK_HTML) {
      // ex) <p><br></p>, <span><br></span>
      return true;
    }

    if (Lists.all(Lists.from(node.childNodes), Nodes.isText) &&
      (node as HTMLElement).innerHTML === '') {
      // ex) <p></p>, <span></span>
      return true;
    }

    return false;
  }

  public static isEmptyAnchor(node: Node): boolean {
    return Nodes.isAnchor(node) && Nodes.isEmpty(node);
  }

  /**
   * padding blankHTML if node is empty (for cursor position)
   */
  public static paddingBlankHTML(node: Node): void {
    if (!Nodes.isVoid(node) && !Nodes.nodeLength(node)) {
      (node as HTMLElement).innerHTML = BLANK_HTML;
    }
  }

  /**
   * find nearest ancestor predicate hit
   */
  public static ancestor(node: Node, pred: (Node) => boolean): Node {
    while (node) {
      if (pred(node)) { return node; }
      if (Nodes.isEditable(node)) { break; }

      node = node.parentNode;
    }
    return null;
  }

  /**
   * find nearest ancestor only single child blood line and predicate hit
   */
  public static singleChildAncestor(node: Node, pred: (Node) => boolean): Node {
    node = node.parentNode;

    while (node) {
      if (Nodes.nodeLength(node) !== 1) { break; }
      if (pred(node)) { return node; }
      if (Nodes.isEditable(node)) { break; }

      node = node.parentNode;
    }
    return null;
  }

  /**
   * returns new array of ancestor nodes (until predicate hit).
   */
  public static listAncestor(
    node: Node, pred?: (Node) => boolean
  ): Array<Node> {
    pred = pred || func.fail;

    const ancestors = [];
    Nodes.ancestor(node, function(el) {
      if (!Nodes.isEditable(el)) {
        ancestors.push(el);
      }

      return pred(el);
    });
    return ancestors;
  }

  /**
   * find farthest ancestor predicate hit
   */
  public static lastAncestor(node: Node, pred: (Node) => boolean): Node {
    const ancestors = Nodes.listAncestor(node);
    return Lists.last(ancestors.filter(pred));
  }

  /**
   * returns common ancestor node between two nodes.
   */
  public static commonAncestor(nodeA: Node, nodeB: Node): Node {
    const ancestors = Nodes.listAncestor(nodeA);
    for (let n = nodeB; n; n = n.parentNode) {
      if (Lists.indexOf(ancestors, n) > -1) { return n; }
    }
    return null; // difference document area
  }

  /**
   * listing all previous siblings (until predicate hit).
   */
  public static listPrev(node: Node, pred?: (Node) => boolean): Array<Node> {
    pred = pred || func.fail;

    const nodes = [];
    while (node) {
      if (pred(node)) { break; }
      nodes.push(node);
      node = node.previousSibling;
    }
    return nodes;
  }

  /**
   * listing next siblings (until predicate hit).
   */
  public static listNext(node: Node, pred?: (Node) => boolean): Array<Node> {
    pred = pred || func.fail;

    const nodes = [];
    while (node) {
      if (pred(node)) { break; }
      nodes.push(node);
      node = node.nextSibling;
    }
    return nodes;
  }

  /**
   * listing descendant nodes
   */
  public static listDescendant(node: Node, pred?: (Node) => boolean): Array<Node> {
    const descendants = [];
    pred = pred || func.ok;

    // start DFS(depth first search) with node
    (function fnWalk(current) {
      if (node !== current && pred(current)) {
        descendants.push(current);
      }
      for (let idx = 0, len = current.childNodes.length; idx < len; idx++) {
        fnWalk(current.childNodes[idx]);
      }
    })(node);

    return descendants;
  }

  /**
   * wrap node with new tag.
   *
   * @param {Node} node
   * @param {Node} tagName of wrapper
   * @return {Node} - wrapper
   */
  public static wrap(node: Node, wrapperName: string): Node {
    const parent = node.parentNode;
    const wrapper = $('<' + wrapperName + '>')[0];

    parent.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    return wrapper;
  }

  /**
   * insert node after preceding
   */
  public static insertAfter(node: Node, preceding: Node): Node {
    const next = preceding.nextSibling;
    let parent = preceding.parentNode;
    if (next) {
      parent.insertBefore(node, next);
    } else {
      parent.appendChild(node);
    }
    return node;
  }

  /**
   * append elements.
   */
  public static appendChildNodes(node: Node, childNodes: Array<Node>): Node {
    for (const child of childNodes) {
      node.appendChild(child);
    }
    return node;
  }

  /**
   * returns whether node is left edge of ancestor or not.
   */
  public static isLeftEdgeOf(node: Node, ancestor: Node): boolean {
    while (node && node !== ancestor) {
      if (Nodes.position(node) !== 0) {
        return false;
      }
      node = node.parentNode;
    }

    return true;
  }

  /**
   * returns whether node is right edge of ancestor or not.
   *
   * @param {Node} node
   * @param {Node} ancestor
   * @return {Boolean}
   */
  public static isRightEdgeOf(node: Node, ancestor: Node): boolean {
    if (!ancestor) {
      return false;
    }
    while (node && node !== ancestor) {
      if (Nodes.position(node) !== Nodes.nodeLength(node.parentNode) - 1) {
        return false;
      }
      node = node.parentNode;
    }

    return true;
  }

  /**
   * returns offset from parent.
   */
  public static position(node): number {
    let offset = 0;
    while ((node = node.previousSibling)) {
      offset += 1;
    }
    return offset;
  }

  public static hasChildren(node: Node): boolean {
    return !!(node && node.childNodes && node.childNodes.length);
  }

  /**
   * return offsetPath(array of offset) from ancestor
   */
  public static makeOffsetPath(ancestor: Node, node: Node): Array<number> {
    const ancestors = Nodes.listAncestor(node, func.eq(ancestor));
    return ancestors.map(Nodes.position).reverse();
  }

  /**
   * return element from offsetPath(array of offset)
   */
  public static fromOffsetPath(ancestor: Node, offsets: Array<number>): Node {
    let current = ancestor;
    for (let i = 0, len = offsets.length; i < len; i++) {
      if (current.childNodes.length <= offsets[i]) {
        current = current.childNodes[current.childNodes.length - 1];
      } else {
        current = current.childNodes[offsets[i]];
      }
    }
    return current;
  }

  /**
   * split element or #text
   *
   * @param {BoundaryPoint} point
   * @param {Object} [options]
   * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
   * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
   * @param {Boolean} [options.isDiscardEmptySplits] - default: false
   * @return {Node} right node of boundaryPoint
   */
  public static splitNode(point, options) {
    let isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
    const isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
    const isDiscardEmptySplits = options && options.isDiscardEmptySplits;

    if (isDiscardEmptySplits) {
      isSkipPaddingBlankHTML = true;
    }

    // edge case
    if (BoundaryPoints.isEdgePoint(point) &&
        (Nodes.isText(point.node) || isNotSplitEdgePoint)) {
      if (BoundaryPoints.isLeftEdgePoint(point)) {
        return point.node;
      } else if (BoundaryPoints.isRightEdgePoint(point)) {
        return point.node.nextSibling;
      }
    }

    // split #text
    if (Nodes.isText(point.node)) {
      return point.node.splitText(point.offset);
    } else {
      const childNode = point.node.childNodes[point.offset];
      const clone = Nodes.insertAfter(point.node.cloneNode(false), point.node);
      Nodes.appendChildNodes(clone, Nodes.listNext(childNode));

      if (!isSkipPaddingBlankHTML) {
        Nodes.paddingBlankHTML(point.node);
        Nodes.paddingBlankHTML(clone);
      }

      if (isDiscardEmptySplits) {
        if (Nodes.isEmpty(point.node)) {
          Nodes.remove(point.node, false);
        }
        if (Nodes.isEmpty(clone)) {
          Nodes.remove(clone, false);
          return point.node.nextSibling;
        }
      }

      return clone;
    }
  }

  /**
   * split tree by point
   *
   * @param {Node} root - split root
   * @param {BoundaryPoint} point
   * @param {Object} [options]
   * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
   * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
   * @return {Node} right node of boundaryPoint
   */
  public static splitTree(root, point, options) {
    // ex) [#text, <span>, <p>]
    const ancestors = Nodes.listAncestor(point.node, func.eq(root));

    if (!ancestors.length) {
      return null;
    } else if (ancestors.length === 1) {
      return Nodes.splitNode(point, options);
    }

    return ancestors.reduce(function(node, parent) {
      if (node === point.node) {
        node = Nodes.splitNode(point, options);
      }

      return Nodes.splitNode({
        node: parent,
        offset: node ? Nodes.position(node) : Nodes.nodeLength(parent),
      }, options);
    });
  }

  public static create(nodeName): Node {
    return document.createElement(nodeName);
  }

  public static createText(text): Text {
    return document.createTextNode(text);
  }

  /**
   * remove node, (isRemoveChild: remove child or not)
   */
  public static remove(node: Node, isRemoveChild: boolean): void {
    if (!node || !node.parentNode) { return; }

    const parent = node.parentNode;
    if (!isRemoveChild) {
      const nodes = [];
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        nodes.push(node.childNodes[i]);
      }

      for (let i = 0, len = nodes.length; i < len; i++) {
        parent.insertBefore(nodes[i], node);
      }
    }

    parent.removeChild(node);
  }

  public static removeWhile(node: Node, pred: (Node) => boolean): void {
    while (node) {
      if (Nodes.isEditable(node) || !pred(node)) {
        break;
      }

      const parent = node.parentNode;
      Nodes.remove(node, false);
      node = parent;
    }
  }

  /**
   * replace node with provided nodeName
   */
  public static replace(node: Node, nodeName: string): Node {
    if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
      return node;
    }

    const newNode = Nodes.create(nodeName);

    if ((node as HTMLElement).style.cssText) {
      (newNode as HTMLElement).style.cssText = (node as HTMLElement).style.cssText;
    }

    Nodes.appendChildNodes(newNode, Lists.from(node.childNodes));
    Nodes.insertAfter(newNode, node);
    Nodes.remove(node, false);

    return newNode;
  }

  public static value($node: any, stripLinebreaks: boolean): string {
    const val = Nodes.isTextarea($node[0]) ? $node.val() : $node.html();
    if (stripLinebreaks) {
      return val.replace(/[\n\r]/g, '');
    }
    return val;
  }

  /**
   * get the HTML contents of node
   */
  public static html($node: any, isNewlineOnBlock: boolean): string {
    let markup = Nodes.value($node, false);

    if (isNewlineOnBlock) {
      const regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
      markup = markup.replace(regexTag, function(match, endSlash, name) {
        name = name.toUpperCase();
        const isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
          !!endSlash;
        const isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);

        return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
      });
      markup = $.trim(markup);
    }

    return markup;
  }

  public static attachEvents($node, events) {
    Object.keys(events).forEach(function(key) {
      $node.on(key, events[key]);
    });
  }

  public static detachEvents($node, events) {
    Object.keys(events).forEach(function(key) {
      $node.off(key, events[key]);
    });
  }

  /**
   * assert if a node contains a "note-styletag" class,
   * which implies that's a custom-made style tag node
   */
  public static isCustomStyleTag(node): boolean {
    return node && !Nodes.isText(node) &&
      Lists.contains(node.classList, 'note-styletag');
  }
}

export class BoundaryPoints {
  public static posFromPlaceholder(placeholder: Node) {
    const $placeholder = $(placeholder);
    const pos = $placeholder.offset();
    const height = $placeholder.outerHeight(true); // include margin

    return {
      left: pos.left,
      top: pos.top + height,
    };
  }

  /**
   * returns whether point is left edge of ancestor or not.
   */
  public static isLeftEdgePointOf(point: BoundaryPoint, ancestor: Node): boolean {
    return BoundaryPoints.isLeftEdgePoint(point) &&
      Nodes.isLeftEdgeOf(point.node, ancestor);
  }

  /**
   * returns whether point is right edge of ancestor or not.
   * @param {BoundaryPoint} point
   * @param {Node} ancestor
   * @return {Boolean}
   */
  public static isRightEdgePointOf(point: BoundaryPoint, ancestor: Node): boolean {
    return BoundaryPoints.isRightEdgePoint(point) &&
      Nodes.isRightEdgeOf(point.node, ancestor);
  }

  /**
   * returns whether boundaryPoint is left edge or not.
   */
  public static isLeftEdgePoint(point: BoundaryPoint): boolean {
    return point.offset === 0;
  }

  /**
   * returns whether boundaryPoint is right edge or not.
   */
  public static isRightEdgePoint(point: BoundaryPoint): boolean {
    return point.offset === Nodes.nodeLength(point.node);
  }

  /**
   * returns whether boundaryPoint is edge or not.
   */
  public static isEdgePoint(point: BoundaryPoint): boolean {
    return BoundaryPoints.isLeftEdgePoint(point) ||
      BoundaryPoints.isRightEdgePoint(point);
  }

  /**
   * returns previous boundaryPoint
   */
  public static prevPoint(
    point: BoundaryPoint, isSkipInnerOffset: boolean
  ): BoundaryPoint {
    let node;
    let offset;

    if (point.offset === 0) {
      if (Nodes.isEditable(point.node)) {
        return null;
      }

      node = point.node.parentNode;
      offset = Nodes.position(point.node);
    } else if (Nodes.hasChildren(point.node)) {
      node = point.node.childNodes[point.offset - 1];
      offset = Nodes.nodeLength(node);
    } else {
      node = point.node;
      offset = isSkipInnerOffset ? 0 : point.offset - 1;
    }

    return {
      node,
      offset,
    };
  }

  /**
   * returns next boundaryPoint
   */
  public static nextPoint(
    point: BoundaryPoint, isSkipInnerOffset: boolean
  ): BoundaryPoint {
    let node, offset;

    if (Nodes.nodeLength(point.node) === point.offset) {
      if (Nodes.isEditable(point.node)) {
        return null;
      }

      node = point.node.parentNode;
      offset = Nodes.position(point.node) + 1;
    } else if (Nodes.hasChildren(point.node)) {
      node = point.node.childNodes[point.offset];
      offset = 0;
    } else {
      node = point.node;
      offset = isSkipInnerOffset ? Nodes.nodeLength(point.node) : point.offset + 1;
    }

    return {
      node: node,
      offset: offset,
    };
  }

  /**
   * returns whether pointA and pointB is same or not.
   */
  public static isSamePoint(pointA: BoundaryPoint, pointB: BoundaryPoint): boolean {
    return pointA.node === pointB.node && pointA.offset === pointB.offset;
  }

  /**
   * returns whether point is visible (can set cursor) or not.
   */
  public static isVisiblePoint(point: BoundaryPoint): boolean {
    if (Nodes.isText(point.node) ||
        !Nodes.hasChildren(point.node) ||
        Nodes.isEmpty(point.node)) {
      return true;
    }

    const leftNode = point.node.childNodes[point.offset - 1];
    const rightNode = point.node.childNodes[point.offset];
    if ((!leftNode || Nodes.isVoid(leftNode)) &&
        (!rightNode || Nodes.isVoid(rightNode))) {
      return true;
    }

    return false;
  }

  public static prevPointUntil(
    point: BoundaryPoint, pred: (BoundaryPoint) => boolean
  ): BoundaryPoint {
    while (point) {
      if (pred(point)) {
        return point;
      }

      point = BoundaryPoints.prevPoint(point, false);
    }

    return null;
  }

  public static nextPointUntil(
    point: BoundaryPoint, pred: (BoundaryPoint) => boolean
  ): BoundaryPoint {
    while (point) {
      if (pred(point)) {
        return point;
      }

      point = BoundaryPoints.nextPoint(point, false);
    }

    return null;
  }

  /**
   * returns whether point has character or not.
   */
  public static isCharPoint(point: BoundaryPoint): boolean {
    if (!Nodes.isText(point.node)) {
      return false;
    }

    const ch = point.node.nodeValue.charAt(point.offset - 1);
    return ch && (ch !== ' ' && ch !== NBSP_CHAR);
  }

  public static walkPoint(
    startPoint: BoundaryPoint,
    endPoint: BoundaryPoint,
    handler: (BounadryPoint) => void,
    isSkipInnerOffset: boolean
  ): void {
    let point = startPoint;

    while (point) {
      handler(point);

      if (BoundaryPoints.isSamePoint(point, endPoint)) {
        break;
      }

      const isSkipOffset = isSkipInnerOffset &&
        startPoint.node !== point.node &&
        endPoint.node !== point.node;
      point = BoundaryPoints.nextPoint(point, isSkipOffset);
    }
  }

  public static splitPoint(point, isInline: boolean) {
    // find splitRoot, container
    //  - inline: splitRoot is a child of paragraph
    //  - block: splitRoot is a child of bodyContainer
    const pred = isInline ? Nodes.isPara : Nodes.isBodyContainer;
    const ancestors = Nodes.listAncestor(point.node, pred);
    const topAncestor = Lists.last(ancestors) || point.node;

    let splitRoot, container;
    if (pred(topAncestor)) {
      splitRoot = ancestors[ancestors.length - 2];
      container = topAncestor;
    } else {
      splitRoot = topAncestor;
      container = splitRoot.parentNode;
    }

    // if splitRoot is exists, split with splitTree
    let pivot = splitRoot && Nodes.splitTree(splitRoot, point, {
      isSkipPaddingBlankHTML: isInline,
      isNotSplitEdgePoint: isInline,
    });

    // if container is point.node, find pivot with point.offset
    if (!pivot && container === point.node) {
      pivot = point.node.childNodes[point.offset];
    }

    return {
      rightNode: pivot,
      container: container,
    };
  }
}
