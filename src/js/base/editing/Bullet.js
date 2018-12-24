import $ from 'jquery';
import { Lists } from '../core/lists';
import * as func from '../core/func';
import { Nodes } from '../core/dom';
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

    const paras = rng.nodes(Nodes.isPara, { includeAncestor: true });
    const clustereds = Lists.clusterBy(paras, func.peq2('parentNode'));

    $.each(clustereds, (idx, paras) => {
      const head = Lists.head(paras);
      if (Nodes.isLi(head)) {
        const previousList = this.findList(head.previousSibling);
        if (previousList) {
          paras
            .map(para => previousList.appendChild(para));
        } else {
          this.wrapList(paras, head.parentNode.nodeName);
          paras
            .map((para) => para.parentNode)
            .map((para) => this.appendToPrevious(para));
        }
      } else {
        $.each(paras, (idx, para) => {
          $(para).css('marginLeft', (idx, val) => {
            return (parseInt(val, 10) || 0) + 25;
          });
        });
      }
    });

    rng.select();
  }

  /**
   * outdent
   */
  outdent(editable) {
    const rng = range.create(editable).wrapBodyInlineWithPara();

    const paras = rng.nodes(Nodes.isPara, { includeAncestor: true });
    const clustereds = Lists.clusterBy(paras, func.peq2('parentNode'));

    $.each(clustereds, (idx, paras) => {
      const head = Lists.head(paras);
      if (Nodes.isLi(head)) {
        this.releaseList([paras]);
      } else {
        $.each(paras, (idx, para) => {
          $(para).css('marginLeft', (idx, val) => {
            val = (parseInt(val, 10) || 0);
            return val > 25 ? val - 25 : '';
          });
        });
      }
    });

    rng.select();
  }

  /**
   * toggle list
   *
   * @param {String} listName - OL or UL
   */
  toggleList(listName, editable) {
    const rng = range.create(editable).wrapBodyInlineWithPara();

    let paras = rng.nodes(Nodes.isPara, { includeAncestor: true });
    const bookmark = rng.paraBookmark(paras);
    const clustereds = Lists.clusterBy(paras, func.peq2('parentNode'));

    // paragraph to list
    if (Lists.find(paras, Nodes.isPurePara)) {
      let wrappedParas = [];
      $.each(clustereds, (idx, paras) => {
        wrappedParas = wrappedParas.concat(this.wrapList(paras, listName));
      });
      paras = wrappedParas;
    // list to paragraph or change list style
    } else {
      const diffLists = rng.nodes(Nodes.isList, {
        includeAncestor: true,
      }).filter((listNode) => {
        return !$.nodeName(listNode, listName);
      });

      if (diffLists.length) {
        $.each(diffLists, (idx, listNode) => {
          Nodes.replace(listNode, listName);
        });
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
    const head = Lists.head(paras);
    const last = Lists.last(paras);

    const prevList = Nodes.isList(head.previousSibling) && head.previousSibling;
    const nextList = Nodes.isList(last.nextSibling) && last.nextSibling;

    const listNode = prevList || Nodes.insertAfter(Nodes.create(listName || 'UL'), last);

    // P to LI
    paras = paras.map((para) => {
      return Nodes.isPurePara(para) ? Nodes.replace(para, 'LI') : para;
    });

    // append to list(<ul>, <ol>)
    Nodes.appendChildNodes(listNode, paras);

    if (nextList) {
      Nodes.appendChildNodes(listNode, Lists.from(nextList.childNodes));
      Nodes.remove(nextList);
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

    $.each(clustereds, (idx, paras) => {
      const head = Lists.head(paras);
      const last = Lists.last(paras);

      const headList = isEscapseToBody ? Nodes.lastAncestor(head, Nodes.isList) : head.parentNode;
      const parentItem = headList.parentNode;

      if (headList.parentNode.nodeName === 'LI') {
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
        const lastList = headList.childNodes.length > 1 ? Nodes.splitTree(headList, {
          node: last.parentNode,
          offset: Nodes.position(last) + 1,
        }, {
          isSkipPaddingBlankHTML: true,
        }) : null;

        const middleList = Nodes.splitTree(headList, {
          node: head.parentNode,
          offset: Nodes.position(head),
        }, {
          isSkipPaddingBlankHTML: true,
        });

        paras = isEscapseToBody ? Nodes.listDescendant(middleList, Nodes.isLi)
          : Lists.from(middleList.childNodes).filter(Nodes.isLi);

        // LI to P
        if (isEscapseToBody || !Nodes.isList(headList.parentNode)) {
          paras = paras.map((para) => {
            return Nodes.replace(para, 'P');
          });
        }

        $.each(Lists.from(paras).reverse(), (idx, para) => {
          Nodes.insertAfter(para, headList);
        });

        // remove empty lists
        const rootLists = Lists.compact([headList, middleList, lastList]);
        $.each(rootLists, (idx, rootList) => {
          const listNodes = [rootList].concat(Nodes.listDescendant(rootList, Nodes.isList));
          $.each(listNodes.reverse(), (idx, listNode) => {
            if (!Nodes.nodeLength(listNode)) {
              Nodes.remove(listNode, true);
            }
          });
        });
      }

      releasedParas = releasedParas.concat(paras);
    });

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
      ? Nodes.appendChildNodes(node.previousSibling, [node])
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
      ? Lists.find(node.children, child => ['OL', 'UL'].indexOf(child.nodeName) > -1)
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
