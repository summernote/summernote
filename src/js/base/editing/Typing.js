define([
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/editing/Bullet'
], function (dom, range, Bullet) {

  /**
   * @class editing.Typing
   *
   * Typing
   *
   */
  var Typing = function (context) {

    var bullet = new Bullet(), // a Bullet instance to toggle lists off
        options = $.extend({ blockquoteBreakingLevel: 2 }, context && context.options); // Break all levels by default

    /**
     * insert tab
     *
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
     *
     * @param {jQuery} $editable
     * @param {WrappedRange} rng Can be used in unit tests to "mock" the range
     */
    this.insertParagraph = function ($editable, rng) {
      rng = rng || range.create();

      // deleteContents on range.
      rng = rng.deleteContents();

      // Wrap range if it needs to be wrapped by paragraph
      rng = rng.wrapBodyInlineWithPara();

      var splitRoot = dom.ancestor(rng.sc, dom.isPara), // finding paragraph
          nextPara,
          blockquoteBreakingLevel = options.blockquoteBreakingLevel;

      // on paragraph: split paragraph
      if (splitRoot) {
        // if it is an empty line with li
        if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) {
          // toogle UL/OL and escape
          bullet.toggleList(splitRoot.parentNode.nodeName);
          return;
        } else {
          var blockquote = null;

          if (blockquoteBreakingLevel === 1) {
            blockquote = dom.ancestor(splitRoot, dom.isBlockquote);
          } else if (blockquoteBreakingLevel === 2) {
            blockquote = dom.lastAncestor(splitRoot, dom.isBlockquote);
          }

          // We're inside a blockquote and options ask us to break it
          if (blockquote) {
            nextPara = $(dom.emptyPara)[0];

            // If the split is right before a <br>, remove it so that there's no "empty line"
            // after the split in the new blockquote created
            if (dom.isRightEdgePoint(rng.getStartPoint()) && dom.isBR(rng.sc.nextSibling)) {
              $(rng.sc.nextSibling).remove();
            }

            var split = dom.splitTree(blockquote, rng.getStartPoint(), { isDiscardEmptySplits: true });

            if (split) {
              split.parentNode.insertBefore(nextPara, split);
            } else {
              dom.insertAfter(nextPara, blockquote); // There's no split if we were at the end of the blockquote
            }
          // not a blockquote, just insert the paragraph
          } else {
            nextPara = dom.splitTree(splitRoot, rng.getStartPoint());

            var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
            emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));

            $.each(emptyAnchors, function (idx, anchor) {
              dom.remove(anchor);
            });

            // replace empty heading or pre with P tag
            if ((dom.isHeading(nextPara) || dom.isPre(nextPara)) && dom.isEmpty(nextPara)) {
              nextPara = dom.replace(nextPara, 'p');
            }
          }
        }
      // no paragraph: insert empty paragraph
      } else {
        var next = rng.sc.childNodes[rng.so];
        nextPara = $(dom.emptyPara)[0];
        if (next) {
          rng.sc.insertBefore(nextPara, next);
        } else {
          rng.sc.appendChild(nextPara);
        }
      }

      range.create(nextPara, 0).normalize().select().scrollIntoView($editable);
    };
  };

  return Typing;
});
