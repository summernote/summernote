import $ from 'jquery';
import lists from '../core/lists';
import func from '../core/func';
import dom from '../core/dom';
import range from '../core/range';

export default class Bullet {
  /**
   * toggle ordered list
   */
  insertOrderedList(editable) {
    this.toggleList('OL', editable);
  }

  /**
   * toggle unordered list
   */
  insertUnorderedList(editable) {
    this.toggleList('UL', editable);
  }

  /**
   * indent
   */
  indent(editable) {
    const rng = range.create(editable).wrapBodyInlineWithPara();

    const paras = rng.nodes(dom.isPara, { includeAncestor: true });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    for (let i = 0; i < clustereds.length; i++) {
      const head = lists.head(clustereds[i]);
      if (dom.isLi(head)) {
        this.wrapList(clustereds[i], head.parentNode.nodeName);
      } else {
        for (var j = 0; j < clustereds[i].length; j++) {
          $(clustereds[i][j]).css('marginLeft', (j, val) => {
            return (parseInt(val, 10) || 0) + 25;
          });
        }
      }
    }

    rng.select();
  }

  /**
   * outdent
   */
  outdent(editable) {
    const rng = range.create(editable).wrapBodyInlineWithPara();

    const paras = rng.nodes(dom.isPara, { includeAncestor: true });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    for (let i = 0; i < clustereds.length; i++) {
      const head = lists.head(clustereds[i]);
      if (dom.isLi(head)) {
        this.releaseList([clustereds[i]]);
      } else {
        for (var j = 0; j < clustereds[i].length; j++) {
          $(clustereds[i][j]).css('marginLeft', (j, val) => {
            val = (parseInt(val, 10) || 0);
            return val > 25 ? val - 25 : '';
          });
        }
      }
    }

    rng.select();
  }

  /**
   * toggle list
   *
   * @param {String} listName - OL or UL
   */
  toggleList(listName, editable) {
    const rng = range.create(editable).wrapBodyInlineWithPara();

    let paras = rng.nodes(dom.isPara, { includeAncestor: true });
    const bookmark = rng.paraBookmark(paras);
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    // paragraph to list
    if (lists.find(paras, dom.isPurePara)) {
      let wrappedParas = [];
      for (let i = 0; i < clustereds.length; i++) {
        wrappedParas = wrappedParas.concat(this.wrapList(clustereds[i], listName));
      }
      paras = wrappedParas;
    // list to paragraph or change list style
    } else {
      const diffLists = rng.nodes(dom.isList, {
        includeAncestor: true,
      }).filter((listNode) => {
        return !$.nodeName(listNode, listName);
      });

      if (diffLists.length) {
        for (let i = diffLists.length - 1; i >= 0; i--) {
          dom.replace(diffLists[i], listName);
        }
      } else {
        paras = this.releaseList(clustereds, true);
      }
    }

    range.createFromParaBookmark(bookmark, paras).select();
  }

  /**
   * @param {Node[]} paras
   * @param {String} listName
   * @return {Node[]}
   */
  wrapList(paras, listName) {
    const head = lists.head(paras);
    const last = lists.last(paras);

    const prevList = dom.isList(head.previousSibling) && head.previousSibling;
    const nextList = dom.isList(last.nextSibling) && last.nextSibling;

    const listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);

    // P to LI
    paras = paras.map((para) => {
      return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
    });

    // append to list(<ul>, <ol>)
    dom.appendChildNodes(listNode, paras);

    if (nextList) {
      dom.appendChildNodes(listNode, lists.from(nextList.childNodes));
      dom.remove(nextList);
    }

    return paras;
  }

  /**
   * @method releaseList
   *
   * @param {Array[]} clustereds
   * @param {Boolean} isEscapseToBody
   * @return {Node[]}
   */
  releaseList(clustereds, isEscapseToBody) {
    let releasedParas = [];

    for (let i = 0; i < clustereds.length; i++) {
      const head = lists.head(clustereds[i]);
      const last = lists.last(clustereds[i]);

      const headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
      const parentItem = headList.parentNode;

      const lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {
        node: last.parentNode,
        offset: dom.position(last) + 1
      }, {
        isSkipPaddingBlankHTML: true
      }) : null;

      const middleList = dom.splitTree(headList, {
        node: head.parentNode,
        offset: dom.position(head)
      }, {
        isSkipPaddingBlankHTML: true
      });

      let paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) : lists.from(middleList.childNodes).filter(dom.isLi);

      if (parentItem.nodeName === 'LI') {
        paras.map(para => {
          const newList = this.findNextSiblings(para);

          if (parentItem.nextSibling) {
            parentItem.parentNode.insertBefore(
              para,
              parentItem.nextSibling
            );
          } else {
            parentItem.parentNode.appendChild(para);
          }

          if (newList.length) {
            this.wrapList(newList, headList.nodeName);
            para.appendChild(newList[0].parentNode);
          }
        });

        if (headList.children.length === 0) {
          parentItem.removeChild(headList);
        }

        if (parentItem.childNodes.length === 0) {
          parentItem.parentNode.removeChild(parentItem);
        }
      } else {
        // LI to P
        if (isEscapseToBody || !dom.isList(parentItem)) {
          paras = paras.map((para) => {
            return dom.replace(para, 'P');
          });
        }

        let items = lists.from(paras);
        for (let j = items.length - 1; j >= 0; j--) {
          dom.insertAfter(items[j], headList);
        }

        // remove empty lists
        const rootLists = lists.compact([headList, middleList, lastList]);
        for (let j = 0; j < rootLists.length; j++) {
          const listNodes = [rootLists[j]].concat(dom.listDescendant(rootLists[j], dom.isList));
          for (let k = listNodes.length - 1; k >= 0; k--) {
            if (!dom.nodeLength(listNodes[k])) {
              dom.remove(listNodes[k], true);
            }
          }
        }
      }

      releasedParas = releasedParas.concat(paras);
    };

    return releasedParas;
  }

  /**
   * @method appendToPrevious
   *
   * Appends list to previous list item, if
   * none exist it wraps the list in a new list item.
   *
   * @param {HTMLNode} ListItem
   * @return {HTMLNode}
   */
  appendToPrevious(node) {
    return node.previousSibling
      ? dom.appendChildNodes(node.previousSibling, [node])
      : this.wrapList([node], 'LI');
  }

  /**
   * @method findList
   *
   * Finds an existing list in list item
   *
   * @param {HTMLNode} ListItem
   * @return {Array[]}
   */
  findList(node) {
    return node
      ? lists.find(node.children, child => ['OL', 'UL'].indexOf(child.nodeName) > -1)
      : null;
  }

  /**
   * @method findNextSiblings
   *
   * Finds all list item siblings that follow it
   *
   * @param {HTMLNode} ListItem
   * @return {HTMLNode}
   */
  findNextSiblings(node) {
    const siblings = [];
    while (node.nextSibling) {
      siblings.push(node.nextSibling);
      node = node.nextSibling;
    }
    return siblings;
  }
}