define([
  'summernote/core/func',
  'summernote/core/list',
  'summernote/core/dom',
  'summernote/core/range',
  'summernote/editing/Bullet'
], function (func, list, dom, range, Bullet) {
  var bullet = new Bullet();

  var Typing = function () {

    this.backspace = function () {
      var rng = range.create();

      if (!rng.isCollapsed()) {
        rng = rng.deleteContents();
      } else if (rng.isLeftEdgeOf(dom.isLi)) {
        var listPara = dom.ancestor(rng.sc, dom.isLi);
        var para = list.head(bullet.releaseList([[listPara]]));
        rng = range.create(para, 0).normalize();
      } else if (rng.isLeftEdgeOf(dom.isBlockquote)) {
        var blockquote = dom.ancestor(rng.sc, dom.isBlockquote);
        dom.remove(blockquote);
      } else if (dom.isText(rng.sc)) {
        rng.sc.nodeValue = func.replaceChar(rng.sc.nodeValue, rng.so, '');
        var prevPoint = dom.prevPointUntil(dom.prevPoint(rng.getStartPoint()),
                        func.and(dom.isVisiblePoint, func.not(dom.isLeftEdgePoint)));

        dom.removeWhile(rng.sc, func.and(dom.isEmpty, dom.isInline));
        rng = range.create(prevPoint.node, prevPoint.offset);
      }

      rng.select();
    };

    /**
     * @param {jQuery} $editable 
     * @param {WrappedRange} rng
     * @param {Number} tabsize
     */
    this.insertTab = function ($editable, rng, tabsize) {
      var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
      rng = rng.deleteContents();
      rng.insertNode(tab, true);

      rng = range.create(tab, tabsize);
      rng.select();
    };

    /**
     * insert paragraph
     */
    this.insertParagraph = function () {
      var rng = range.create();

      // deleteContents on range.
      rng = rng.deleteContents();

      rng = rng.wrapBodyInlineWithPara();

      // find split root node: block level node
      var splitRoot = dom.ancestor(rng.sc, dom.isPara);
      var nextPara = dom.splitTree(splitRoot, rng.getStartPoint());

      var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
      emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));

      $.each(emptyAnchors, function (idx, anchor) {
        dom.remove(anchor);
      });

      range.create(nextPara, 0).normalize().select();
    };

  };

  return Typing;
});
