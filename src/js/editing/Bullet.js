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
    
    const paras = rng.childNodes(dom.isPara, { includeAncestor: true });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    $.each(clustereds, (idx, paras) => {
      const head = lists.head(paras);
      if (dom.isLi(head)) {
        const previousList = this.findList(head.previousElementSibling);
        if (previousList) {
          paras
            .map(para => previousList.appendChild(para));
        } else {
          if (head.previousElementSibling && (head.previousElementSibling.nodeName.toUpperCase() === "LI" )) {               
            this.wrapList(paras, head.parentNode.nodeName);
              
            // move ul element to parent li element
            paras
              .map((para) => para.parentNode)
            // distinct
              .filter(function(elem, index, self) {   return index === self.indexOf(elem);  })
              .map((para) => this.appendToPrevious(para));
          }
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

    const paras = rng.nodes(dom.isPara, { includeAncestor: true });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    $.each(clustereds, (idx, paras) => {
      const head = lists.head(paras);
      if (dom.isLi(head)) {
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

    let origStartingNode = rng.getStartPoint(); 

    // try to find a suitable anchor node. First, fetch paragraph-anchestor
    let sp = dom.ancestor(rng.sc, dom.isPara);
    if (sp) {
    // get all nodes starting from the paragraph till the beginning of the marked node
      const betweenRng = range.create(sp, rng.eo, rng.sc, rng.so);

      const allNodes = betweenRng.childNodes( function(node) {return !dom.isEmpty(node);}, {maxDepth : 20});          
      // var clusteredNodes = lists.clusterBy(allNodes, func.peq2('parentNode')); // paragraph to list

      // check if between parent and selected text is content. If yes, the selected text needs to be wrapped for indentation
      if (allNodes && allNodes.length > 0 && allNodes[allNodes.length-1].textContent.trim() != allNodes[1].textContent.trim()) {
        // get all nodes in the selected area 
        let toWrap = rng.childNodes( function(node) {return !dom.isEmpty(node);}, {}); 
       
        // wrapp all nodes into a paragraph
        let para = dom.create("P");
        toWrap[0].parentNode.insertBefore(para, toWrap[0]);
        const topWrapArr = [...toWrap];
        topWrapArr.reverse().forEach(function(value) { para.appendChild(value); } );
       
        // set new paragraph as starting point for the range
        rng.setStartPoint(para, rng.eo);
      }
      else {  // no wrapping needed, use found para element as starting point
        rng.setStartPoint(sp, rng.eo);
      }
    }

    var paras = rng.childNodes(dom.isPara, {
      includeAncestor: false,
    });
    
    
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));

    // paragraph to list
    if (lists.find(paras, dom.isPurePara)) {
      let wrappedParas = [];
      $.each(clustereds, (idx, paras) => {
        wrappedParas = wrappedParas.concat(this.wrapList(paras, listName));
      });
      paras = wrappedParas;
    // list to paragraph or change list style
    } else {
      const diffLists = rng.childNodes(dom.isList, {
        includeAncestor: true,
      }).filter((listNode) => {
        return (listNode.nodeName !== listName);
      });

      if (diffLists.length) {
        $.each(diffLists, (idx, listNode) => {
          dom.replace(listNode, listName);
        });
      } else {
        paras = this.releaseList(clustereds, false);
      }
    }

    // starting point might have changed, reset to original
    rng.setStartPoint(origStartingNode.node, origStartingNode.offset);
    var bookmark = rng.paraBookmark(paras);
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

    const prevList = dom.isList(dom.prevNonEmptyNode(head)) && dom.prevNonEmptyNode(head);
    const nextList = dom.isList(dom.nextNonEmptyNode(head)) && dom.nextNonEmptyNode(head);

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
    var topLevelNodes = clustereds[0];
    if (!topLevelNodes) {
      return [];
    }
    var head = lists.head(topLevelNodes);
    var last = lists.last(topLevelNodes);
    var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
    var parentItem = headList.parentNode;
    var retList = topLevelNodes;
      
    // remove a double bullet point if present (happens with <li><ul> for example).
    // get text between li and parentItem
    if (headList && headList.parentNode && headList.parentNode.nodeName === 'LI') {
      var txtBetween = "";
      var brPresent = false;
      dom.walkPoint({node: parentItem, offset: 0}, {node: headList, offset: 0}, function(point) {
        if (point.node.nodeType === 3) {
          txtBetween += point.node.nodeValue;
        }
        else if (point.node.nodeType === 1 && point.node.nodeName === "BR") {
          brPresent = true;
        }
      });
        
      if (txtBetween.trim() === '' && !brPresent) {
        // fix ul/ol direct after li
        if (parentItem != null && parentItem.previousElementSibling != null && parentItem.previousElementSibling.nodeName === "LI") { 
          parentItem.previousElementSibling.appendChild(headList);
          parentItem.remove();
          return;
        }
      }
    }
      

    // if last selected element has further siblings, wrap this rest into a sublist of the last selected element
    var sibling = last.nextSibling;
    var remaining = [];
    while (sibling) {  // collect all non-empty siblings
      if (!dom.isEmpty(sibling)) {  // ignore empty text nodes
        remaining.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    // if further siblings are found after the selected li's, create a new list as child of the last li-element
    var childList;
    if (remaining.length > 0) {
      var listType = head.parentNode.nodeName;
      childList = last.appendChild(dom.create(listType));
      dom.appendChildNodes(childList, remaining);
    }
      
    // outdent the selected top-level elements
    // if still within a list, move li's one level up        
    if (headList.parentNode.nodeName === 'LI') {
      var topLevelNodesArr = [...topLevelNodes];  
      // insert between li-elements or append
      if (parentItem.nextElementSibling) {
        topLevelNodesArr.reverse().forEach( function(value) {   // Reverse nodes to keep the order after adding
          parentItem.parentNode.insertBefore(value, parentItem.nextElementSibling); 
        } );
      } else {  // append at the end of the parent list
        topLevelNodesArr.forEach(function(value) {
          parentItem.parentNode.appendChild(value); 
        } );
      }       
    } else {  // outdent to an upper level without parent ul/ol, remove li therefore and append
      retList = [];
      if (headList.nextSibling) { // insert after ul/ol if not at the end of the node list (insertBefore)
        topLevelNodes.forEach( function(value) {
          // remove li and insert below as normal text.
          var arrayNodes = [...value.childNodes];
          arrayNodes.reverse().forEach( function(toInsert) {  // Reverse childnodes to keep the order after adding
            if (!dom.isPurePara(toInsert) && !dom.isList(toInsert)) { // if child is neither a paragraph or list, wrap within p
              toInsert = dom.wrap(toInsert, 'p');
            }
            retList.push(toInsert);
            parentItem.insertBefore(toInsert, headList.nextSibling);
          });
          value.remove();
        } );
      } else { // already at the node end, so add new node(s) at the end (append)
        topLevelNodes.forEach(function(value) {
          if (value.hasChildNodes()) { // skip empty li elements, just remove them (e.g. pressing return on last empty li element)
            var arrayNodes = [...value.childNodes];  
            arrayNodes.forEach( function(toInsert) {
              if (!dom.isPurePara(toInsert) && !dom.isList(toInsert)) { // if child is neither a paragraph or list, wrap within p
                toInsert = dom.wrap(toInsert, 'p');
              }
              retList.push(toInsert);
              parentItem.append(toInsert);
            } );
          }
          value.remove();
        } );
      }
    }
                
    // cleanup remaining empty ul/li elements, if all li elements where outdented
    if (headList.childElementCount === 0) {
      headList.remove();
    }
      
    // childList was temporarily used to intend the sublist. Remove it from the outdented list
    retList = retList.filter( function( el ) {
      return childList != el;
    } );
    return retList;
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
    return node.previousElementSibling
      ? dom.appendChildNodes(node.previousElementSibling, [node])
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
      ? node.children && lists.find(node.children, child => ['OL', 'UL'].indexOf(child.nodeName) > -1)
      : null;
  }

  /**
   * @method findNextElementSiblings
   *
   * Finds all list item siblings that follow it
   *
   * @param {HTMLNode} ListItem
   * @return {HTMLNode}
   */
  findNextElementSiblings(node) {
    const siblings = [];
    while (node.nextElementSibling) {
      siblings.push(node.nextElementSibling);
      node = node.nextElementSibling;
    }
    return siblings;
  }
}
