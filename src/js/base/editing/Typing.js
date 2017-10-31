import $ from 'jquery';
import dom from '../core/dom';
import range from '../core/range';
import Bullet from '../editing/Bullet';

/**
 * @class editing.Typing
 *
 * Typing
 *
 */
export default class Typing {
  constructor() {
    // a Bullet instance to toggle lists off
    this.bullet = new Bullet();
  }

  /**
   * insert tab
   *
   * @param {WrappedRange} rng
   * @param {Number} tabsize
   */
  insertTab(rng, tabsize) {
    const tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
    rng = rng.deleteContents();
    rng.insertNode(tab, true);

    rng = range.create(tab, tabsize);
    rng.select();
  }

  /**
   * insert paragraph
   */
  insertParagraph(editable) {
    let rng = range.create(editable);

    // deleteContents on range.
    rng = rng.deleteContents();

    // Wrap range if it needs to be wrapped by paragraph
    rng = rng.wrapBodyInlineWithPara();

    // finding paragraph
    const splitRoot = dom.ancestor(rng.sc, dom.isPara);

    let nextPara;
    // on paragraph: split paragraph
    if (splitRoot) {
      // if it is an empty line with li
      if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) {
        // toogle UL/OL and escape
        this.bullet.toggleList(splitRoot.parentNode.nodeName);
        return;
      // if it is an empty line with para on blockquote
      } else if (dom.isEmpty(splitRoot) && dom.isPara(splitRoot) && dom.isBlockquote(splitRoot.parentNode)) {
        // escape blockquote
        dom.insertAfter(splitRoot, splitRoot.parentNode);
        nextPara = splitRoot;
      // if new line has content (not a line break)
      } else {
        nextPara = dom.splitTree(splitRoot, rng.getStartPoint());

        let emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
        emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));

        $.each(emptyAnchors, (idx, anchor) => {
          dom.remove(anchor);
        });

        // replace empty heading, pre or custom-made styleTag with P tag
        if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) {
          nextPara = dom.replace(nextPara, 'p');
        }
      }
    // no paragraph: insert empty paragraph
    } else {
      const next = rng.sc.childNodes[rng.so];
      nextPara = $(dom.emptyPara)[0];
      if (next) {
        rng.sc.insertBefore(nextPara, next);
      } else {
        rng.sc.appendChild(nextPara);
      }
    }

    range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
  }
}
