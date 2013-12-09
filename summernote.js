/**
 * summernote.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
(function ($, CodeMirror) {
  'use strict';
  /**
   * object which check platform/agent
   */
  var agent = {
    bMac: navigator.appVersion.indexOf('Mac') > -1,
    bMSIE: navigator.userAgent.indexOf('MSIE') > -1,
    bFF: navigator.userAgent.indexOf('Firefox') > -1,
    bCodeMirror: !!CodeMirror
  };

  /**
   * func utils (for high-order func's arg)
   */
  var func = (function () {
    var eq = function (elA) { return function (elB) { return elA === elB; }; };
    var eq2 = function (elA, elB) { return elA === elB; };
    var fail = function () { return false; };
    var not = function (f) { return function () { return !f.apply(f, arguments); }; };
    var self = function (a) { return a; };
    return { eq: eq, eq2: eq2, fail: fail, not: not, self: self };
  })();

  /**
   * list utils
   */
  var list = (function () {
    var head = function (array) { return array[0]; };
    var last = function (array) { return array[array.length - 1]; };
    var initial = function (array) { return array.slice(0, array.length - 1); };
    var tail = function (array) { return array.slice(1); };

    /**
     * get sum from a list
     * @param {array} array - array
     * @param {function} fn - iterator
     */
    var sum = function (array, fn) {
      fn = fn || func.self;
      return array.reduce(function (memo, v) {
        return memo + fn(v);
      }, 0);
    };

    /**
     * returns a copy of the collection with array type.
     * @param {collection} collection - collection eg) node.childNodes, ...
     */
    var from = function (collection) {
      var result = [], idx = -1, length = collection.length;
      while (++idx < length) {
        result[idx] = collection[idx];
      }
      return result;
    };

    /**
     * cluster item by second function
     * @param {array} array - array
     * @param {function} fn - predicate function for cluster rule
     */
    var clusterBy = function (array, fn) {
      if (array.length === 0) { return []; }
      var aTail = tail(array);
      return aTail.reduce(function (memo, v) {
        var aLast = last(memo);
        if (fn(last(aLast), v)) {
          aLast[aLast.length] = v;
        } else {
          memo[memo.length] = [v];
        }
        return memo;
      }, [[head(array)]]);
    };

    /**
     * returns a copy of the array with all falsy values removed
     * @param {array} array - array
     * @param {function} fn - predicate function for cluster rule
     */
    var compact = function (array) {
      var aResult = [];
      for (var idx = 0, sz = array.length; idx < sz; idx ++) {
        if (array[idx]) { aResult.push(array[idx]); }
      }
      return aResult;
    };

    return { head: head, last: last, initial: initial, tail: tail,
             sum: sum, from: from, compact: compact, clusterBy: clusterBy };
  })();

  /**
   * aysnc functions which returns deferred object
   */
  var async = (function () {
    /**
     * readFile
     * @param {file} file - file object
     */
    var readFile = function (file) {
      return $.Deferred(function (deferred) {
        var reader = new FileReader();
        reader.onload = function (e) { deferred.resolve(e.target.result); };
        reader.onerror = function () { deferred.reject(this); };
        reader.readAsDataURL(file);
      }).promise();
    };

    /**
     * loadImage from url string
     * @param {string} sUrl
     */
    var loadImage = function (sUrl) {
      return $.Deferred(function (deferred) {
        var image = new Image();
        image.onload = loaded;
        image.onerror = errored; // URL returns 404, etc
        image.onabort = errored; // IE may call this if user clicks "Stop"
        image.src = sUrl;
         
        function loaded() {
          unbindEvents();
          deferred.resolve(image);
        }
        function errored() {
          unbindEvents();
          deferred.reject(image);
        }
        function unbindEvents() {
          image.onload = null;
          image.onerror = null;
          image.onabort = null;
        }
      }).promise();
    };

    return { readFile: readFile, loadImage: loadImage };
  })();

  /**
   * dom utils
   */
  var dom = (function () {
    /**
     * returns predicate which judge whether nodeName is same
     */
    var makePredByNodeName = function (sNodeName) {
      // nodeName of element is always uppercase.
      return function (node) {
        return node && node.nodeName === sNodeName;
      };
    };

    var isPara = function (node) {
      // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
      return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName);
    };

    var emptyPara = '<p><br/></p>';

    var isList = function (node) {
      return node && /^UL|^OL/.test(node.nodeName);
    };

    var isEditable = function (node) {
      return node && $(node).hasClass('note-editable');
    };

    var isControlSizing = function (node) {
      return node && $(node).hasClass('note-control-sizing');
    };

    /**
     * find nearest ancestor predicate hit
     * @param {element} node
     * @param {function} pred - predicate function
     */
    var ancestor = function (node, pred) {
      while (node) {
        if (pred(node)) { return node; }
        node = node.parentNode;
      }
      return null;
    };

    /**
     * returns new array of ancestor nodes (until predicate hit).
     * @param {element} node
     * @param {function} [optional] pred - predicate function
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
     * @param {element} nodeA
     * @param {element} nodeB
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
     * @param {element} nodeA
     * @param {element} nodeB
     */
    var listBetween = function (nodeA, nodeB) {
      var aNode = [];

      var bStart = false, bEnd = false;
      var fnWalk = function (node) {
        if (!node) { return; } // traverse fisnish
        if (node === nodeA) { bStart = true; } // start point
        if (bStart && !bEnd) { aNode.push(node); } // between
        if (node === nodeB) { bEnd = true; return; } // end point

        for (var idx = 0, sz = node.childNodes.length; idx < sz; idx++) {
          fnWalk(node.childNodes[idx]);
        }
      };

      fnWalk(commonAncestor(nodeA, nodeB)); // DFS with commonAcestor.
      return aNode;
    };

    /**
     * listing all prevSiblings (until predicate hit).
     * @param {element} node
     * @param {function} [optional] pred - predicate function
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
     * listing nextSiblings (until predicate hit).
     * @param {element} node
     * @param {function} pred [optional] - predicate function
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
     * insert node after preceding
     * @param {element} node
     * @param {element} preceding - predicate function
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
     * append children
     * @param {element} node
     * @param {collection} aChild
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
     * @param {element} node
     */
    var length = function (node) {
      if (isText(node)) { return node.nodeValue.length; }
      return node.childNodes.length;
    };

    /**
     * returns offset from parent.
     * @param {element} node
     */
    var position = function (node) {
      var offset = 0;
      while (node = node.previousSibling) { offset += 1; }
      return offset;
    };

    /**
     * return offsetPath(array of offset) from ancestor
     * @param {element} ancestor - ancestor node
     * @param {element} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var aAncestor = list.initial(listAncestor(node, func.eq(ancestor)));
      return $.map(aAncestor, position).reverse();
    };

    /**
     * return element from offsetPath(array of offset)
     * @param {element} ancestor - ancestor node
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
     * @param {element} node
     * @param {number} offset
     */
    var splitData = function (node, offset) {
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
     * @param {element} root
     * @param {element} pivot - this will be boundaryPoint's node
     * @param {number} offset - this will be boundaryPoint's offset
     */
    var split = function (root, pivot, offset) {
      var aAncestor = listAncestor(pivot, func.eq(root));
      if (aAncestor.length === 1) { return splitData(pivot, offset); }
      return aAncestor.reduce(function (node, parent) {
        var clone = parent.cloneNode(false);
        insertAfter(clone, parent);
        if (node === pivot) {
          node = splitData(node, offset);
        }
        appends(clone, listNext(node));
        return clone;
      });
    };

    /**
     * remove node, (bRemoveChild: remove child or not)
     * @param {element} node
     * @param {boolean} bRemoveChild
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
      emptyPara: emptyPara,
      isText: isText,
      isPara: isPara,
      isList: isList,
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      isAnchor: makePredByNodeName('A'),
      isDiv: makePredByNodeName('DIV'),
      isSpan: makePredByNodeName('SPAN'),
      isB: makePredByNodeName('B'),
      isU: makePredByNodeName('U'),
      isS: makePredByNodeName('S'),
      isI: makePredByNodeName('I'),
      isImg: makePredByNodeName('IMG'),
      isTextarea: makePredByNodeName('TEXTAREA'),
      ancestor: ancestor,
      listAncestor: listAncestor,
      listNext: listNext,
      listPrev: listPrev,
      commonAncestor: commonAncestor,
      listBetween: listBetween,
      insertAfter: insertAfter,
      position: position,
      makeOffsetPath: makeOffsetPath,
      fromOffsetPath: fromOffsetPath,
      split: split,
      remove: remove,
      html: html
    };
  })();

  /**
   * range module
   */
  var range = (function () {
    var bW3CRangeSupport = !!document.createRange;

    // return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
    var textRange2bp = function (textRange, bStart) {
      var elCont = textRange.parentElement(), nOffset;

      var tester = document.body.createTextRange(), elPrevCont;
      var aChild = list.from(elCont.childNodes);
      for (nOffset = 0; nOffset < aChild.length; nOffset++) {
        if (dom.isText(aChild[nOffset])) { continue; }
        tester.moveToElementText(aChild[nOffset]);
        if (tester.compareEndPoints('StartToStart', textRange) >= 0) { break; }
        elPrevCont = aChild[nOffset];
      }

      if (nOffset !== 0 && dom.isText(aChild[nOffset - 1])) {
        var textRangeStart = document.body.createTextRange(), elCurText = null;
        textRangeStart.moveToElementText(elPrevCont || elCont);
        textRangeStart.collapse(!elPrevCont);
        elCurText = elPrevCont ? elPrevCont.nextSibling : elCont.firstChild;

        var pointTester = textRange.duplicate();
        pointTester.setEndPoint('StartToStart', textRangeStart);
        var nTextCount = pointTester.text.replace(/[\r\n]/g, '').length;

        while (nTextCount > elCurText.nodeValue.length && elCurText.nextSibling) {
          nTextCount -= elCurText.nodeValue.length;
          elCurText = elCurText.nextSibling;
        }

        /* jshint ignore:start */
        var sDummy = elCurText.nodeValue; //enforce IE to re-reference elCurText, hack
        /* jshint ignore:end */

        if (bStart && elCurText.nextSibling && dom.isText(elCurText.nextSibling) &&
            nTextCount === elCurText.nodeValue.length) {
          nTextCount -= elCurText.nodeValue.length;
          elCurText = elCurText.nextSibling;
        }

        elCont = elCurText;
        nOffset = nTextCount;
      }

      return {cont: elCont, offset: nOffset};
    };

    // return TextRange from boundary point (inspired by google closure-library)
    var bp2textRange = function (bp) {
      var textRangeInfo = function (elCont, nOffset) {
        var elNode, bCollapseToStart;

        if (dom.isText(elCont)) {
          var aPrevText = dom.listPrev(elCont, func.not(dom.isText));
          var elPrevCont = list.last(aPrevText).previousSibling;
          elNode =  elPrevCont || elCont.parentNode;
          nOffset += list.sum(list.tail(aPrevText), dom.length);
          bCollapseToStart = !elPrevCont;
        } else {
          elNode = elCont.childNodes[nOffset] || elCont;
          if (dom.isText(elNode)) {
            return textRangeInfo(elNode, nOffset);
          }

          nOffset = 0;
          bCollapseToStart = false;
        }

        return {cont: elNode, collapseToStart: bCollapseToStart, offset: nOffset};
      };

      var textRange = document.body.createTextRange();
      var info = textRangeInfo(bp.cont, bp.offset);

      textRange.moveToElementText(info.cont);
      textRange.collapse(info.collapseToStart);
      textRange.moveStart('character', info.offset);
      return textRange;
    };

    // {startContainer, startOffset, endContainer, endOffset}
    var WrappedRange = function (sc, so, ec, eo) {
      this.sc = sc;
      this.so = so;
      this.ec = ec;
      this.eo = eo;

      // nativeRange: get nativeRange from sc, so, ec, eo
      var nativeRange = function () {
        if (bW3CRangeSupport) {
          var w3cRange = document.createRange();
          w3cRange.setStart(sc, so);
          w3cRange.setEnd(ec, eo);
          return w3cRange;
        } else {
          var textRange = bp2textRange({cont: sc, offset: so});
          textRange.setEndPoint('EndToEnd', bp2textRange({cont: ec, offset: eo}));
          return textRange;
        }
      };

      // select: update visible range
      this.select = function () {
        var nativeRng = nativeRange();
        if (bW3CRangeSupport) {
          var selection = document.getSelection();
          if (selection.rangeCount > 0) { selection.removeAllRanges(); }
          selection.addRange(nativeRng);
        } else {
          nativeRng.select();
        }
      };

      // listPara: listing paragraphs on range
      this.listPara = function () {
        var aNode = dom.listBetween(sc, ec);
        var aPara = list.compact($.map(aNode, function (node) {
          return dom.ancestor(node, dom.isPara);
        }));
        return $.map(list.clusterBy(aPara, func.eq2), list.head);
      };

      // makeIsOn: return isOn(pred) function
      var makeIsOn = function (pred) {
        return function () {
          var elAncestor = dom.ancestor(sc, pred);
          return elAncestor && (elAncestor === dom.ancestor(ec, pred));
        };
      };

      // isOnEditable: judge whether range is on editable or not
      this.isOnEditable = makeIsOn(dom.isEditable);
      // isOnList: judge whether range is on list node or not
      this.isOnList = makeIsOn(dom.isList);
      // isOnAnchor: judge whether range is on anchor node or not
      this.isOnAnchor = makeIsOn(dom.isAnchor);
      // isCollapsed: judge whether range was collapsed
      this.isCollapsed = function () { return sc === ec && so === eo; };

      // insertNode
      this.insertNode = function (node) {
        var nativeRng = nativeRange();
        if (bW3CRangeSupport) {
          nativeRng.insertNode(node);
        } else {
          nativeRng.pasteHTML(node.outerHTML); // NOTE: missing node reference.
        }
      };

      this.toString = function () {
        var nativeRng = nativeRange();
        return bW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
      };

      //bookmark: offsetPath bookmark
      this.bookmark = function (elEditable) {
        return {
          s: { path: dom.makeOffsetPath(elEditable, sc), offset: so },
          e: { path: dom.makeOffsetPath(elEditable, ec), offset: eo }
        };
      };
    };

    return { // Range Object
      // create Range Object From arguments or Browser Selection
      create : function (sc, so, ec, eo) {
        if (arguments.length === 0) { // from Browser Selection
          if (bW3CRangeSupport) { // webkit, firefox
            var selection = document.getSelection();
            if (selection.rangeCount === 0) { return null; }

            var nativeRng = selection.getRangeAt(0);
            sc = nativeRng.startContainer;
            so = nativeRng.startOffset;
            ec = nativeRng.endContainer;
            eo = nativeRng.endOffset;
          } else { // IE8: TextRange
            var textRange = document.selection.createRange();
            var textRangeEnd = textRange.duplicate();
            textRangeEnd.collapse(false);
            var textRangeStart = textRange;
            textRangeStart.collapse(true);

            var bpStart = textRange2bp(textRangeStart, true),
            bpEnd = textRange2bp(textRangeEnd, false);

            sc = bpStart.cont;
            so = bpStart.offset;
            ec = bpEnd.cont;
            eo = bpEnd.offset;
          }
        } else if (arguments.length === 2) { //collapsed
          ec = sc;
          eo = so;
        }
        return new WrappedRange(sc, so, ec, eo);
      },
      // createFromBookmark
      createFromBookmark : function (elEditable, bookmark) {
        var sc = dom.fromOffsetPath(elEditable, bookmark.s.path);
        var so = bookmark.s.offset;
        var ec = dom.fromOffsetPath(elEditable, bookmark.e.path);
        var eo = bookmark.e.offset;
        return new WrappedRange(sc, so, ec, eo);
      }
    };
  })();

  /**
   * Style
   */
  var Style = function () {
    // para level style
    this.stylePara = function (rng, oStyle) {
      var aPara = rng.listPara();
      $.each(aPara, function (idx, elPara) {
        $.each(oStyle, function (sKey, sValue) {
          elPara.style[sKey] = sValue;
        });
      });
    };

    // get current style, elTarget: target element on event.
    this.current = function (rng, elTarget) {
      var $cont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var oStyle = $cont.css(['font-size', 'text-align',
                                'list-style-type', 'line-height']) || {};

      oStyle['font-size'] = parseInt(oStyle['font-size']);

      // document.queryCommandState for toggle state
      oStyle['font-bold'] = document.queryCommandState('bold') ? 'bold' : 'normal';
      oStyle['font-italic'] = document.queryCommandState('italic') ? 'italic' : 'normal';
      oStyle['font-underline'] = document.queryCommandState('underline') ? 'underline' : 'normal';

      // list-style-type to list-style(unordered, ordered)
      if (!rng.isOnList()) {
        oStyle['list-style'] = 'none';
      } else {
        var aOrderedType = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var bUnordered = $.inArray(oStyle['list-style-type'], aOrderedType) > -1;
        oStyle['list-style'] = bUnordered ? 'unordered' : 'ordered';
      }

      var elPara = dom.ancestor(rng.sc, dom.isPara);
      if (elPara && elPara.style['line-height']) {
        oStyle['line-height'] = elPara.style.lineHeight;
      } else {
        var lineHeight = parseInt(oStyle['line-height']) / parseInt(oStyle['font-size']);
        oStyle['line-height'] = lineHeight.toFixed(1);
      }

      oStyle.image = dom.isImg(elTarget) && elTarget;
      oStyle.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      oStyle.aAncestor = dom.listAncestor(rng.sc, dom.isEditable);

      return oStyle;
    };
  };

  /**
   * History
   */
  var History = function () {
    var aUndo = [], aRedo = [];

    var makeSnap = function ($editable) {
      var elEditable = $editable[0], rng = range.create();
      return {
        contents: $editable.html(),
        bookmark: rng.bookmark(elEditable),
        scrollTop: $editable.scrollTop()
      };
    };

    var applySnap = function ($editable, oSnap) {
      $editable.html(oSnap.contents).scrollTop(oSnap.scrollTop);
      range.createFromBookmark($editable[0], oSnap.bookmark).select();
    };

    this.undo = function ($editable) {
      var oSnap = makeSnap($editable);
      if (aUndo.length === 0) { return; }
      applySnap($editable, aUndo.pop());
      aRedo.push(oSnap);
    };

    this.redo = function ($editable) {
      var oSnap = makeSnap($editable);
      if (aRedo.length === 0) { return; }
      applySnap($editable, aRedo.pop());
      aUndo.push(oSnap);
    };

    this.recordUndo = function ($editable) {
      aRedo = [];
      aUndo.push(makeSnap($editable));
    };
  };

  /**
   * Editor
   */
  var Editor = function () {
    // save current range
    this.saveRange = function ($editable) {
      $editable.data('range', range.create());
    };

    // restore lately range
    this.restoreRange = function ($editable) {
      var rng = $editable.data('range');
      if (rng) { rng.select(); }
    };

    //currentStyle
    var style = new Style();
    this.currentStyle = function (elTarget) {
      var rng = range.create();
      return rng.isOnEditable() && style.current(rng, elTarget);
    };

    this.tab = function ($editable) {
      recordUndo($editable);
      var rng = range.create();
      var sNbsp = new Array($editable.data('tabsize') + 1).join('&nbsp;');
      rng.insertNode($('<span id="noteTab">' + sNbsp + '</span>')[0]);
      var $tab = $('#noteTab').removeAttr('id');
      rng = range.create($tab[0], 1);
      rng.select();
      dom.remove($tab[0]);
    };

    // undo
    this.undo = function ($editable) {
      $editable.data('NoteHistory').undo($editable);
    };

    // redo
    this.redo = function ($editable) {
      $editable.data('NoteHistory').redo($editable);
    };

    // recordUndo
    var recordUndo = this.recordUndo = function ($editable) {
      $editable.data('NoteHistory').recordUndo($editable);
    };

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var aCmd = ['bold', 'italic', 'underline', 'strikethrough',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                'insertOrderedList', 'insertUnorderedList',
                'indent', 'outdent', 'formatBlock', 'removeFormat',
                'backColor', 'foreColor', 'insertHorizontalRule'];

    for (var idx = 0, len = aCmd.length; idx < len; idx ++) {
      this[aCmd[idx]] = (function (sCmd) {
        return function ($editable, sValue) {
          recordUndo($editable);
          document.execCommand(sCmd, false, sValue);
        };
      })(aCmd[idx]);
    }
    /* jshint ignore:end */

    this.insertImage = function ($editable, sUrl) {
      async.loadImage(sUrl).done(function (image) {
        recordUndo($editable);
        var $image = $('<img>').attr('src', sUrl);
        $image.css('width', Math.min($editable.width(), image.width));
        range.create().insertNode($image[0]);
      }).fail(function () {
        var callbacks = $editable.data('callbacks');
        if (callbacks.onImageUploadError) {
          callbacks.onImageUploadError();
        }
      });
    };

    this.formatBlock = function ($editable, sValue) {
      recordUndo($editable);
      sValue = agent.bMSIE ? '<' + sValue + '>' : sValue;
      document.execCommand('FormatBlock', false, sValue);
    };

    this.fontSize = function ($editable, sValue) {
      recordUndo($editable);
      document.execCommand('fontSize', false, 3);
      if (agent.bFF) {
        // firefox: <font size="3"> to <span style='font-size={sValue}px;'>, buggy
        $editable.find('font[size=3]').removeAttr('size').css('font-size', sValue + 'px');
      } else {
        // chrome: <span style="font-size: medium"> to <span style='font-size={sValue}px;'>
        $editable.find('span').filter(function () {
          return this.style.fontSize === 'medium';
        }).css('font-size', sValue + 'px');
      }
    };

    this.lineHeight = function ($editable, sValue) {
      recordUndo($editable);
      style.stylePara(range.create(), {lineHeight: sValue});
    };

    this.unlink = function ($editable) {
      var rng = range.create();
      if (rng.isOnAnchor()) {
        recordUndo($editable);
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.create(elAnchor, 0, elAnchor, 1);
        rng.select();
        document.execCommand('unlink');
      }
    };

    this.setLinkDialog = function ($editable, fnShowDialog) {
      var rng = range.create();
      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.create(elAnchor, 0, elAnchor, 1);
      }
      fnShowDialog({
        range: rng,
        text: rng.toString(),
        url: rng.isOnAnchor() ? dom.ancestor(rng.sc, dom.isAnchor).href : ''
      }, function (sLinkUrl) {
        rng.select();
        recordUndo($editable);

        var sLinkUrlWithProtocol;
        if (sLinkUrl.indexOf('@') !== -1) { // email address
          sLinkUrlWithProtocol = sLinkUrl.indexOf(':') !== -1 ? sLinkUrl : 'mailto:' + sLinkUrl;
        } else { // normal address
          sLinkUrlWithProtocol = sLinkUrl.indexOf('://') !== -1 ? sLinkUrl : 'http://' + sLinkUrl;
        }

        //IE: createLink when range collapsed.
        if (agent.bMSIE && rng.isCollapsed()) {
          rng.insertNode($('<A id="linkAnchor">' + sLinkUrl + '</A>')[0]);
          var $anchor = $('#linkAnchor').removeAttr('id')
                                          .attr('href', sLinkUrlWithProtocol);
          rng = range.create($anchor[0], 0, $anchor[0], 1);
          rng.select();
        } else {
          document.execCommand('createlink', false, sLinkUrlWithProtocol);
        }
      });
    };

    this.color = function ($editable, sObjColor) {
      var oColor = JSON.parse(sObjColor);
      var foreColor = oColor.foreColor, backColor = oColor.backColor;

      recordUndo($editable);
      if (foreColor) { document.execCommand('foreColor', false, foreColor); }
      if (backColor) { document.execCommand('backColor', false, backColor); }
    };

    this.insertTable = function ($editable, sDim) {
      recordUndo($editable);
      var aDim = sDim.split('x');
      var nCol = aDim[0], nRow = aDim[1];

      var aTD = [], sTD;
      var sWhitespace = agent.bMSIE ? '&nbsp;' : '<br/>';
      for (var idxCol = 0; idxCol < nCol; idxCol++) {
        aTD.push('<td>' + sWhitespace + '</td>');
      }
      sTD = aTD.join('');

      var aTR = [], sTR;
      for (var idxRow = 0; idxRow < nRow; idxRow++) {
        aTR.push('<tr>' + sTD + '</tr>');
      }
      sTR = aTR.join('');
      var sTable = '<table class="table table-bordered">' + sTR + '</table>';
      range.create().insertNode($(sTable)[0]);
    };

    this.floatMe = function ($editable, sValue, elTarget) {
      recordUndo($editable);
      elTarget.style.cssFloat = sValue;
    };

    this.resize = function ($editable, sValue, elTarget) {
      recordUndo($editable);
      elTarget.style.width = $editable.width() * sValue + 'px';
      elTarget.style.height = '';
    };

    this.resizeTo = function (pos, $target) {
      var newRatio = pos.y / pos.x;
      var ratio = $target.data('ratio');

      $target.css({
        width: ratio > newRatio ? pos.x : pos.y / ratio,
        height: ratio > newRatio ? pos.x * ratio : pos.y
      });
    };
  };

  /**
   * Toolbar
   */
  var Toolbar = function () {
    this.update = function ($toolbar, oStyle) {
      //handle selectbox for fontsize, lineHeight
      var checkDropdownMenu = function ($btn, nValue) {
        $btn.find('.dropdown-menu li a').each(function () {
          var bChecked = parseFloat($(this).data('value')) === nValue;
          this.className = bChecked ? 'checked' : '';
        });
      };

      var $fontsize = $toolbar.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').html(oStyle['font-size']);
      checkDropdownMenu($fontsize, parseFloat(oStyle['font-size']));

      var $lineHeight = $toolbar.find('.note-height');
      checkDropdownMenu($lineHeight, parseFloat(oStyle['line-height']));

      //check button state
      var btnState = function (sSelector, pred) {
        var $btn = $toolbar.find(sSelector);
        $btn[pred() ? 'addClass' : 'removeClass']('active');
      };

      btnState('button[data-event="bold"]', function () {
        return oStyle['font-bold'] === 'bold';
      });
      btnState('button[data-event="italic"]', function () {
        return oStyle['font-italic'] === 'italic';
      });
      btnState('button[data-event="underline"]', function () {
        return oStyle['font-underline'] === 'underline';
      });
      btnState('button[data-event="justifyLeft"]', function () {
        return oStyle['text-align'] === 'left' || oStyle['text-align'] === 'start';
      });
      btnState('button[data-event="justifyCenter"]', function () {
        return oStyle['text-align'] === 'center';
      });
      btnState('button[data-event="justifyRight"]', function () {
        return oStyle['text-align'] === 'right';
      });
      btnState('button[data-event="justifyFull"]', function () {
        return oStyle['text-align'] === 'justify';
      });
      btnState('button[data-event="insertUnorderedList"]', function () {
        return oStyle['list-style'] === 'unordered';
      });
      btnState('button[data-event="insertOrderedList"]', function () {
        return oStyle['list-style'] === 'ordered';
      });
    };

    this.updateRecentColor = function (elBtn, sEvent, sValue) {
      var $color = $(elBtn).closest('.note-color');
      var $recentColor = $color.find('.note-recent-color');
      var oColor = JSON.parse($recentColor.attr('data-value'));
      oColor[sEvent] = sValue;
      $recentColor.attr('data-value', JSON.stringify(oColor));
      var sKey = sEvent === 'backColor' ? 'background-color' : 'color';
      $recentColor.find('i').css(sKey, sValue);
    };

    this.updateFullscreen = function ($toolbar, bFullscreen) {
      var $btn = $toolbar.find('button[data-event="fullscreen"]');
      $btn[bFullscreen ? 'addClass' : 'removeClass']('active');
    };
    this.updateCodeview = function ($toolbar, bCodeview) {
      var $btn = $toolbar.find('button[data-event="codeview"]');
      $btn[bCodeview ? 'addClass' : 'removeClass']('active');
    };

    this.enable = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').removeClass('disabled');
    };

    this.disable = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').addClass('disabled');
    };
  };

  /**
   * Popover (http://getbootstrap.com/javascript/#popovers)
   */
  var Popover = function () {
    var showPopover = function ($popover, elPlaceholder) {
      var $placeholder = $(elPlaceholder);
      var pos = $placeholder.position(), height = $placeholder.height();
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top + height
      });
    };

    this.update = function ($popover, oStyle) {
      var $linkPopover = $popover.find('.note-link-popover'),
          $imagePopover = $popover.find('.note-image-popover');
      if (oStyle.anchor) {
        var $anchor = $linkPopover.find('a');
        $anchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        showPopover($linkPopover, oStyle.anchor);
      } else {
        $linkPopover.hide();
      }

      if (oStyle.image) {
        showPopover($imagePopover, oStyle.image);
      } else {
        $imagePopover.hide();
      }
    };

    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  /**
   * Handle
   */
  var Handle = function () {
    this.update = function ($handle, oStyle) {
      var $selection = $handle.find('.note-control-selection');
      if (oStyle.image) {
        var $image = $(oStyle.image);
        var pos = $image.position();
        var szImage = {w: $image.width(), h: $image.height()};
        $selection.css({
          display: 'block',
          left: pos.left,
          top: pos.top,
          width: szImage.w,
          height: szImage.h
        }).data('target', oStyle.image); // save current image element.
        var sSizing = szImage.w + 'x' + szImage.h;
        $selection.find('.note-control-selection-info').text(sSizing);
      } else {
        $selection.hide();
      }
    };

    this.hide = function ($handle) {
      $handle.children().hide();
    };
  };

  /**
   * Dialog
   */
  var Dialog = function () {
    this.showImageDialog = function ($dialog, hDropImage, fnInsertImages, fnInsertImage) {
      var $imageDialog = $dialog.find('.note-image-dialog');
      var $dropzone = $dialog.find('.note-dropzone'),
          $imageInput = $dialog.find('.note-image-input'),
          $imageUrl = $dialog.find('.note-image-url'),
          $imageBtn = $dialog.find('.note-image-btn');

      $imageDialog.on('shown.bs.modal', function () {
        $dropzone.on('dragenter dragover dragleave', false);
        $dropzone.on('drop', function (e) {
          hDropImage(e);
          $imageDialog.modal('hide');
        });
        $imageInput.on('change', function () {
          fnInsertImages(this.files);
          $(this).val('');
          $imageDialog.modal('hide');
        });
        $imageUrl.val('').keyup(function () {
          if ($imageUrl.val()) {
            $imageBtn.removeClass('disabled').attr('disabled', false);
          } else {
            $imageBtn.addClass('disabled').attr('disabled', true);
          }
        }).trigger('focus');
        $imageBtn.click(function (event) {
          $imageDialog.modal('hide');
          fnInsertImage($imageUrl.val());
          event.preventDefault();
        });
      }).on('hidden.bs.modal', function () {
        $dropzone.off('dragenter dragover dragleave drop');
        $imageInput.off('change');
        $imageDialog.off('shown.bs.modal hidden.bs.modal');
        $imageUrl.off('keyup');
        $imageBtn.off('click');
      }).modal('show');
    };

    this.showLinkDialog = function ($dialog, linkInfo, callback) {
      var $linkDialog = $dialog.find('.note-link-dialog');
      var $linkText = $linkDialog.find('.note-link-text'),
          $linkUrl = $linkDialog.find('.note-link-url'),
          $linkBtn = $linkDialog.find('.note-link-btn');

      $linkDialog.on('shown.bs.modal', function () {
        $linkText.html(linkInfo.text);
        $linkUrl.val(linkInfo.url).keyup(function () {
          if ($linkUrl.val()) {
            $linkBtn.removeClass('disabled').attr('disabled', false);
          } else {
            $linkBtn.addClass('disabled').attr('disabled', true);
          }

          if (!linkInfo.text) { $linkText.html($linkUrl.val()); }
        }).trigger('focus');
        $linkBtn.click(function (event) {
          $linkDialog.modal('hide'); //hide and createLink (ie9+)
          callback($linkUrl.val());
          event.preventDefault();
        });
      }).on('hidden.bs.modal', function () {
        $linkUrl.off('keyup');
        $linkBtn.off('click');
        $linkDialog.off('shown.bs.modal hidden.bs.modal');
      }).modal('show');
    };

    this.showHelpDialog = function ($dialog) {
      $dialog.find('.note-help-dialog').modal('show');
    };
  };

  /**
   * EventHandler
   *
   * handle mouse & key event on note
   */
  var EventHandler = function () {
    var editor = new Editor();
    var toolbar = new Toolbar(), popover = new Popover();
    var handle = new Handle(), dialog = new Dialog();

    var key = { BACKSPACE: 8, TAB: 9, ENTER: 13, SPACE: 32,
                NUM0: 48, NUM1: 49, NUM6: 54, NUM7: 55, NUM8: 56,
                B: 66, E: 69, I: 73, J: 74, K: 75, L: 76, R: 82, S: 83, U: 85,
                Y: 89, Z: 90, SLASH: 191,
                LEFTBRACKET: 219, BACKSLACH: 220, RIGHTBRACKET: 221 };

    // makeLayoutInfo from editor's descendant node.
    var makeLayoutInfo = function (descendant) {
      var $editor = $(descendant).closest('.note-editor');
      return {
        editor: function () { return $editor; },
        toolbar: function () { return $editor.find('.note-toolbar'); },
        editable: function () { return $editor.find('.note-editable'); },
        codable: function () { return $editor.find('.note-codable'); },
        statusbar: function () { return $editor.find('.note-statusbar'); },
        popover: function () { return $editor.find('.note-popover'); },
        handle: function () { return $editor.find('.note-handle'); },
        dialog: function () { return $editor.find('.note-dialog'); }
      };
    };

    var hKeydown = function (event) {
      var bCmd = agent.bMac ? event.metaKey : event.ctrlKey,
          bShift = event.shiftKey, keyCode = event.keyCode;

      // optimize
      var bExecCmd = (bCmd || bShift || keyCode === key.TAB);
      var oLayoutInfo = (bExecCmd) ? makeLayoutInfo(event.target) : null;

      if (keyCode === key.TAB && oLayoutInfo.editable().data('tabsize')) {
        editor.tab(oLayoutInfo.editable());
      } else if (bCmd && ((bShift && keyCode === key.Z) || keyCode === key.Y)) {
        editor.redo(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.Z) {
        editor.undo(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.B) {
        editor.bold(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.I) {
        editor.italic(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.U) {
        editor.underline(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.S) {
        editor.strikethrough(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.BACKSLACH) {
        editor.removeFormat(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.K) {
        oLayoutInfo.editable();
        editor.setLinkDialog(oLayoutInfo.editable(), function (linkInfo, cb) {
          dialog.showLinkDialog(oLayoutInfo.dialog(), linkInfo, cb);
        });
      } else if (bCmd && keyCode === key.SLASH) {
        dialog.showHelpDialog(oLayoutInfo.dialog());
      } else if (bCmd && bShift && keyCode === key.L) {
        editor.justifyLeft(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.E) {
        editor.justifyCenter(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.R) {
        editor.justifyRight(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.J) {
        editor.justifyFull(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.NUM7) {
        editor.insertUnorderedList(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.NUM8) {
        editor.insertOrderedList(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.LEFTBRACKET) {
        editor.outdent(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.RIGHTBRACKET) {
        editor.indent(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.NUM0) { // formatBlock Paragraph
        editor.formatBlock(oLayoutInfo.editable(), 'P');
      } else if (bCmd && (key.NUM1 <= keyCode && keyCode <= key.NUM6)) {
        var sHeading = 'H' + String.fromCharCode(keyCode); // H1~H6
        editor.formatBlock(oLayoutInfo.editable(), sHeading);
      } else if (bCmd && keyCode === key.ENTER) {
        editor.insertHorizontalRule(oLayoutInfo.editable());
      } else {
        if (keyCode === key.BACKSPACE || keyCode === key.ENTER ||
            keyCode === key.SPACE) {
          editor.recordUndo(makeLayoutInfo(event.target).editable());
        }
        return; // not matched
      }
      event.preventDefault(); //prevent default event for FF
    };

    var insertImages = function ($editable, files) {
      var callbacks = $editable.data('callbacks');
      editor.restoreRange($editable);
      if (callbacks.onImageUpload) { // call custom handler
        callbacks.onImageUpload(files, editor, $editable);
      } else {
        $.each(files, function (idx, file) {
          async.readFile(file).done(function (sURL) {
            editor.insertImage($editable, sURL);
          }).fail(function () {
            if (callbacks.onImageUploadError) {
              callbacks.onImageUploadError();
            }
          });
        });
      }
    };

    var hDropImage = function (event) {
      var dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
        insertImages(oLayoutInfo.editable(), dataTransfer.files);
      }
      event.stopPropagation();
      event.preventDefault();
    };

    var hMousedown = function (event) {
      //preventDefault Selection for FF, IE8+
      if (dom.isImg(event.target)) { event.preventDefault(); }
    };

    var hToolbarAndPopoverUpdate = function (event) {
      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var oStyle = editor.currentStyle(event.target);
      if (!oStyle) { return; }
      toolbar.update(oLayoutInfo.toolbar(), oStyle);
      popover.update(oLayoutInfo.popover(), oStyle);
      handle.update(oLayoutInfo.handle(), oStyle);
    };

    var hScroll = function (event) {
      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      //hide popover and handle when scrolled
      popover.hide(oLayoutInfo.popover());
      handle.hide(oLayoutInfo.handle());
    };

    var hHandleMousedown = function (event) {
      if (dom.isControlSizing(event.target)) {
        var oLayoutInfo = makeLayoutInfo(event.target),
            $handle = oLayoutInfo.handle(), $popover = oLayoutInfo.popover(),
            $editable = oLayoutInfo.editable(), $editor = oLayoutInfo.editor();

        var elTarget = $handle.find('.note-control-selection').data('target'),
            $target = $(elTarget);
        var posStart = $target.offset(),
            scrollTop = $(document).scrollTop(), posDistance;

        $editor.on('mousemove', function (event) {
          posDistance = {x: event.clientX - posStart.left,
                         y: event.clientY - (posStart.top - scrollTop)};
          editor.resizeTo(posDistance, $target);
          handle.update($handle, {image: elTarget});
          popover.update($popover, {image: elTarget});
        }).on('mouseup', function () {
          $editor.off('mousemove').off('mouseup');
        });

        if (!$target.data('ratio')) { // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }

        editor.recordUndo($editable);
        event.stopPropagation();
        event.preventDefault();
      }
    };

    var hToolbarAndPopoverMousedown = function (event) {
      // prevent default event when insertTable (FF, Webkit)
      var $btn = $(event.target).closest('[data-event]');
      if ($btn.length > 0) { event.preventDefault(); }
    };

    var hToolbarAndPopoverClick = function (event) {
      var $btn = $(event.target).closest('[data-event]');

      if ($btn.length > 0) {
        var sEvent = $btn.attr('data-event'),
            sValue = $btn.attr('data-value');

        var oLayoutInfo = makeLayoutInfo(event.target);
        var $editor = oLayoutInfo.editor(),
            $toolbar = oLayoutInfo.toolbar(),
            $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable(),
            $codable = oLayoutInfo.codable();

        // before command
        var elTarget;
        if ($.inArray(sEvent, ['resize', 'floatMe']) !== -1) {
          var $handle = oLayoutInfo.handle();
          var $selection = $handle.find('.note-control-selection');
          elTarget = $selection.data('target');
        }

        if (editor[sEvent]) { // on command
          $editable.trigger('focus');
          editor[sEvent]($editable, sValue, elTarget);
        }

        // after command
        if ($.inArray(sEvent, ['backColor', 'foreColor']) !== -1) {
          toolbar.updateRecentColor($btn[0], sEvent, sValue);
        } else if (sEvent === 'showLinkDialog') { // popover to dialog
          $editable.focus();
          editor.setLinkDialog($editable, function (linkInfo, cb) {
            dialog.showLinkDialog($dialog, linkInfo, cb);
          });
        } else if (sEvent === 'showImageDialog') {
          $editable.focus();
          dialog.showImageDialog($dialog, hDropImage, function (files) {
            insertImages($editable, files);
          }, function (sUrl) {
            editor.restoreRange($editable);
            editor.insertImage($editable, sUrl);
          });
        } else if (sEvent === 'showHelpDialog') {
          dialog.showHelpDialog($dialog);
        } else if (sEvent === 'fullscreen') {
          $editor.toggleClass('fullscreen');

          var hResizeFullscreen = function () {
            var nHeight = $(window).height() - $toolbar.outerHeight();
            $editable.css('height', nHeight);
          };

          var bFullscreen = $editor.hasClass('fullscreen');
          if (bFullscreen) {
            $editable.data('orgHeight', $editable.css('height'));
            $(window).resize(hResizeFullscreen).trigger('resize');
          } else {
            var hasOptionHeight = !!$editable.data('optionHeight');
            $editable.css('height', hasOptionHeight ? $editable.data('orgHeight') : 'auto');
            $(window).off('resize');
          }

          toolbar.updateFullscreen($toolbar, bFullscreen);
        } else if (sEvent === 'codeview') {
          $editor.toggleClass('codeview');

          var bCodeview = $editor.hasClass('codeview');
          if (bCodeview) {
            $codable.val($editable.html());
            $codable.height($editable.height());
            toolbar.disable($toolbar);
            $codable.focus();

            // activate CodeMirror as codable
            if (agent.bCodeMirror) {
              var cmEditor = CodeMirror.fromTextArea($codable[0], $.extend({
                mode: 'text/html',
                lineNumbers: true
              }, $editor.data('options').codemirror));
              // CodeMirror hasn't Padding.
              cmEditor.setSize(null, $editable.outerHeight());
              // autoFormatRange If formatting included
              if (cmEditor.autoFormatRange) {
                cmEditor.autoFormatRange({line: 0, ch: 0}, {
                  line: cmEditor.lineCount(),
                  ch: cmEditor.getTextArea().value.length
                });
              }
              $codable.data('cmEditor', cmEditor);
            }
          } else {
            // deactivate CodeMirror as codable
            if (agent.bCodeMirror) {
              $codable.data('cmEditor').toTextArea();
            }

            $editable.html($codable.val() || dom.emptyPara);
            $editable.height($editable.data('optionHeight') ? $codable.height() : 'auto');

            toolbar.enable($toolbar);
            $editable.focus();
          }

          toolbar.updateCodeview(oLayoutInfo.toolbar(), bCodeview);
        }

        hToolbarAndPopoverUpdate(event);
      }
    };

    var EDITABLE_PADDING = 24;
    var hStatusbarMousedown = function (event) {
      var $document = $(document);
      var oLayoutInfo = makeLayoutInfo(event.target);
      var $editable = oLayoutInfo.editable();

      var nEditableTop = $editable.offset().top - $document.scrollTop();
      var hMousemove = function (event) {
        $editable.height(event.clientY - (nEditableTop + EDITABLE_PADDING));
      };
      var hMouseup = function () {
        $document.unbind('mousemove', hMousemove)
                   .unbind('mouseup', hMouseup);
      };
      $document.mousemove(hMousemove).mouseup(hMouseup);
      event.stopPropagation();
      event.preventDefault();
    };

    var PX_PER_EM = 18;
    var hDimensionPickerMove = function (event) {
      var $picker = $(event.target.parentNode); // target is mousecatcher
      var $dimensionDisplay = $picker.next();
      var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
      var $highlighted = $picker.find('.note-dimension-picker-highlighted');
      var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
      var posOffset;
      if (event.offsetX === undefined) {
        // HTML5 with jQuery - e.offsetX is undefined in Firefox
        var posCatcher = $(event.target).offset();
        posOffset = {x: event.pageX - posCatcher.left,
                     y: event.pageY - posCatcher.top};
      } else {
        posOffset = {x: event.offsetX, y: event.offsetY};
      }

      var dim = {c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
                 r: Math.ceil(posOffset.y / PX_PER_EM) || 1};

      $highlighted.css({ width: dim.c + 'em', height: dim.r + 'em' });
      $catcher.attr('data-value', dim.c + 'x' + dim.r);

      if (3 < dim.c && dim.c < 10) { // 5~10
        $unhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (3 < dim.r && dim.r < 10) { // 5~10
        $unhighlighted.css({ height: dim.r + 1 + 'em'});
      }

      $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    };

    /**
     * Attach eventhandler
     * @param {object} oLayoutInfo - layout Informations
     * @param {object} options - user options include custom event handlers
     * @param {function} options.enter - enter key handler
     */
    this.attach = function (oLayoutInfo, options) {
      oLayoutInfo.editable.on('keydown', hKeydown);
      oLayoutInfo.editable.on('mousedown', hMousedown);
      oLayoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      oLayoutInfo.editable.on('scroll', hScroll);
      //TODO: handle Drag point
      oLayoutInfo.editable.on('dragenter dragover dragleave', false);
      oLayoutInfo.editable.on('drop', hDropImage);

      oLayoutInfo.handle.on('mousedown', hHandleMousedown);

      oLayoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
      oLayoutInfo.popover.on('click', hToolbarAndPopoverClick);
      oLayoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);
      oLayoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);

      oLayoutInfo.statusbar.on('mousedown', hStatusbarMousedown);

      //toolbar table dimension
      var $toolbar = oLayoutInfo.toolbar;
      var $catcher = $toolbar.find('.note-dimension-picker-mousecatcher');
      $catcher.on('mousemove', hDimensionPickerMove);

      // save selection when focusout
      oLayoutInfo.editable.on('blur', function () {
        editor.saveRange(oLayoutInfo.editable);
      });

      // basic event callbacks (lowercase)
      // enter, focus, blur, keyup, keydown
      if (options.onenter) {
        oLayoutInfo.editable.keypress(function (event) {
          if (event.keyCode === key.ENTER) { options.onenter(event); }
        });
      }
      if (options.onfocus) { oLayoutInfo.editable.focus(options.onfocus); }
      if (options.onblur) { oLayoutInfo.editable.blur(options.onblur); }
      if (options.onkeyup) { oLayoutInfo.editable.keyup(options.onkeyup); }
      if (options.onkeydown) { oLayoutInfo.editable.keydown(options.onkeydown); }

      // callbacks for advanced features (camel)
      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      oLayoutInfo.editable.data('callbacks', {
        onChange: options.onChange,
        onAutoSave: options.onAutoSave,
        onPasteBefore: options.onPasteBefore,
        onPasteAfter: options.onPasteAfter,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUpload,
        onFileUpload: options.onFileUpload,
        onFileUploadError: options.onFileUpload
      });
    };

    this.dettach = function (oLayoutInfo) {
      oLayoutInfo.editable.off();
      oLayoutInfo.toolbar.off();
      oLayoutInfo.handle.off();
      oLayoutInfo.popover.off();
    };
  };

  /**
   * Locale
   */
  var Locale = {
    'en-US': {
      font: {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strike: 'Strike',
        clear: 'Remove Font Style',
        height: 'Line Height',
        size: 'Font Size'
      },
      image: {
        image: 'Picture',
        insert: 'Insert Image',
        resize_full: 'Resize Full',
        resize_half: 'Resize Half',
        resize_quarter: 'Resize Quarter',
        float_left: 'Float Left',
        float_right: 'Float Right',
        float_none: 'Float None',
        drag_image_here: 'Drag an image here',
        select_from_files: 'Select from files',
        url: 'Image URL'
      },
      link: {
        link: 'Link',
        insert: 'Insert Link',
        unlink: 'Unlink',
        edit: 'Edit',
        text_to_display: 'Text to display',
        url: 'To what URL should this link go?'
      },
      table: {
        table: 'Table'
      },
      hr: {
        insert: 'Insert Horizontal Rule'
      },
      style: {
        style: 'Style',
        normal: 'Normal',
        blockquote: 'Quote',
        pre: 'Code',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6'
      },
      lists: {
        unordered: 'Unordered list',
        ordered: 'Ordered list'
      },
      options: {
        help: 'Help',
        fullscreen: 'Full Screen',
        codeview: 'Code View'
      },
      paragraph: {
        paragraph: 'Paragraph',
        outdent: 'Outdent',
        indent: 'Indent',
        left: 'Align left',
        center: 'Align center',
        right: 'Align right',
        justify: 'Justify full'
      },
      color: {
        recent: 'Recent Color',
        more: 'More Color',
        background: 'BackColor',
        foreground: 'FontColor',
        transparent: 'Transparent',
        set_transparent: 'Set transparent',
        reset: 'Reset',
        reset_to_default: 'Reset to default'
      },
      shortcut: {
        shortcuts: 'Keyboard shortcuts',
        close: 'Close',
        text_formatting: 'Text formatting',
        action: 'Action',
        paragraph_formatting: 'Paragraph formatting',
        document_style: 'Document Style'
      },
      history: {
        undo: 'Undo',
        redo: 'Redo'
      }
    },

    'nl-NL': {
      font: {
        bold: 'Vet',
        italic: 'Cursief',
        underline: 'Onderstrepen',
        strike: 'Doorhalen',
        clear: 'Stijl verwijderen',
        height: 'Regelhoogte',
        size: 'Tekstgrootte'
      },
      image: {
        image: 'Afbeelding',
        insert: 'Afbeelding invoegen',
        resize_full: 'Volledige breedte',
        resize_half: 'Halve breedte',
        resize_quarter: 'Kwart breedte',
        float_left: 'Links uitlijnen',
        float_right: 'Rechts uitlijnen',
        float_none: 'Geen uitlijning',
        drag_image_here: 'Sleep hier een afbeelding naar toe',
        select_from_files: 'Selecteer een bestand',
        url: 'URL van de afbeelding'
      },
      link: {
        link: 'Link',
        insert: 'Link invoegen',
        unlink: 'Link verwijderen',
        edit: 'Wijzigen',
        text_to_display: 'Tekst van link',
        url: 'Naar welke URL moet deze link verwijzen?'
      },
      table: {
        table: 'Tabel'
      },
      hr: {
        insert: 'Horizontale lijn invoegen'
      },
      style: {
        style: 'Stijl',
        normal: 'Normaal',
        blockquote: 'Quote',
        pre: 'Code',
        h1: 'Kop 1',
        h2: 'Kop 2',
        h3: 'Kop 3',
        h4: 'Kop 4',
        h5: 'Kop 5',
        h6: 'Kop 6'
      },
      lists: {
        unordered: 'Ongeordende lijst',
        ordered: 'Geordende lijst'
      },
      options: {
        help: 'Help',
        fullscreen: 'Volledig scherm',
        codeview: 'Bekijk Code'
      },
      paragraph: {
        paragraph: 'Paragraaf',
        outdent: 'Inspringen verkleinen',
        indent: 'Inspringen vergroten',
        left: 'Links uitlijnen',
        center: 'Centreren',
        right: 'Rechts uitlijnen',
        justify: 'Uitvullen'
      },
      color: {
        recent: 'Recente kleur',
        more: 'Meer kleuren',
        background: 'Achtergrond kleur',
        foreground: 'Tekst kleur',
        transparent: 'Transparant',
        set_transparent: 'Transparant',
        reset: 'Standaard',
        reset_to_default: 'Standaard kleur'
      },
      shortcut: {
        shortcuts: 'Toetsencombinaties',
        close: 'sluiten',
        text_formatting: 'Tekststijlen',
        action: 'Acties',
        paragraph_formatting: 'Paragraafstijlen',
        document_style: 'Documentstijlen'
      },
      history: {
        undo: 'Ongedaan maken',
        redo: 'Opnieuw doorvoeren'
      }
    }
  };

  /**
   * Renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function () {
    /* jshint ignore:start */
    var aToolbarItem = {
      picture: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.image + '" data-event="showImageDialog" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';
      },
      link: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.link + '" data-event="showLinkDialog" data-shortcut="Ctrl+K" data-mac-shortcut="⌘+K" tabindex="-1"><i class="fa fa-link icon-link"></i></button>';
      },
      table: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.table.table + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-table icon-table"></i> <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<div class="note-dimension-picker">' +
        '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' +
        '<div class="note-dimension-picker-highlighted"></div>' +
        '<div class="note-dimension-picker-unhighlighted"></div>' +
        '</div>' +
        '<div class="note-dimension-display"> 1 x 1 </div>' +
        '</ul>';
      },
      style: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.style.style + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-magic icon-magic"></i> <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="formatBlock" data-value="p">' + locale.style.normal + '</a></li>' +
        '<li><a data-event="formatBlock" data-value="blockquote"><blockquote>' + locale.style.blockquote + '</blockquote></a></li>' +
        '<li><a data-event="formatBlock" data-value="pre">' + locale.style.pre + '</a></li>' +
        '<li><a data-event="formatBlock" data-value="h1"><h1>' + locale.style.h1 + '</h1></a></li>' +
        '<li><a data-event="formatBlock" data-value="h2"><h2>' + locale.style.h2 + '</h2></a></li>' +
        '<li><a data-event="formatBlock" data-value="h3"><h3>' + locale.style.h3 + '</h3></a></li>' +
        '<li><a data-event="formatBlock" data-value="h4"><h4>' + locale.style.h4 + '</h4></a></li>' +
        '<li><a data-event="formatBlock" data-value="h5"><h5>' + locale.style.h5 + '</h5></a></li>' +
        '<li><a data-event="formatBlock" data-value="h6"><h6>' + locale.style.h6 + '</h6></a></li>' +
        '</ul>';
      },
      fontsize: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + locale.font.size + '" tabindex="-1"><span class="note-current-fontsize">11</span> <b class="caret"></b></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="fontSize" data-value="8"><i class="fa fa-check icon-ok"></i> 8</a></li>' +
        '<li><a data-event="fontSize" data-value="9"><i class="fa fa-check icon-ok"></i> 9</a></li>' +
        '<li><a data-event="fontSize" data-value="10"><i class="fa fa-check icon-ok"></i> 10</a></li>' +
        '<li><a data-event="fontSize" data-value="11"><i class="fa fa-check icon-ok"></i> 11</a></li>' +
        '<li><a data-event="fontSize" data-value="12"><i class="fa fa-check icon-ok"></i> 12</a></li>' +
        '<li><a data-event="fontSize" data-value="14"><i class="fa fa-check icon-ok"></i> 14</a></li>' +
        '<li><a data-event="fontSize" data-value="18"><i class="fa fa-check icon-ok"></i> 18</a></li>' +
        '<li><a data-event="fontSize" data-value="24"><i class="fa fa-check icon-ok"></i> 24</a></li>' +
        '<li><a data-event="fontSize" data-value="36"><i class="fa fa-check icon-ok"></i> 36</a></li>' +
        '</ul>';
      },
      color: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small note-recent-color" title="' + locale.color.recent + '" data-event="color" data-value=\'{"backColor":"yellow"}\' tabindex="-1"><i class="fa fa-font icon-font" style="color:black;background-color:yellow;"></i></button>' +
        '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.color.more + '" data-toggle="dropdown" tabindex="-1">' +
        '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu">' +
        '<li>' +
        '<div class="btn-group">' +
        '<div class="note-palette-title">' + locale.color.background + '</div>' +
        '<div class="note-color-reset" data-event="backColor" data-value="inherit" title="' + locale.color.transparent + '">' + locale.color.set_transparent + '</div>' +
        '<div class="note-color-palette" data-target-event="backColor"></div>' +
        '</div>' +
        '<div class="btn-group">' +
        '<div class="note-palette-title">' + locale.color.foreground + '</div>' +
        '<div class="note-color-reset" data-event="foreColor" data-value="inherit" title="' + locale.color.reset + '">' + locale.color.reset_to_default + '</div>' +
        '<div class="note-color-palette" data-target-event="foreColor"></div>' +
        '</div>' +
        '</li>' +
        '</ul>';
      },
      bold: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.bold + '" data-shortcut="Ctrl+B" data-mac-shortcut="⌘+B" data-event="bold" tabindex="-1"><i class="fa fa-bold icon-bold"></i></button>';
      },
      italic: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.italic + '" data-shortcut="Ctrl+I" data-mac-shortcut="⌘+I" data-event="italic" tabindex="-1"><i class="fa fa-italic icon-italic"></i></button>';
      },
      underline: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.underline + '" data-shortcut="Ctrl+U" data-mac-shortcut="⌘+U" data-event="underline" tabindex="-1"><i class="fa fa-underline icon-underline"></i></button>';
      },
      clear: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.clear + '" data-shortcut="Ctrl+\\" data-mac-shortcut="⌘+\\" data-event="removeFormat" tabindex="-1"><i class="fa fa-eraser icon-eraser"></i></button>';
      },
      ul: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.lists.unordered + '" data-shortcut="Ctrl+Shift+8" data-mac-shortcut="⌘+⇧+7" data-event="insertUnorderedList" tabindex="-1"><i class="fa fa-list-ul icon-list-ul"></i></button>';
      },
      ol: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.lists.ordered + '" data-shortcut="Ctrl+Shift+7" data-mac-shortcut="⌘+⇧+8" data-event="insertOrderedList" tabindex="-1"><i class="fa fa-list-ol icon-list-ol"></i></button>';
      },
      paragraph: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.paragraph.paragraph + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i>  <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
          '<li>' +
          '<div class="note-align btn-group">' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.left + '" data-shortcut="Ctrl+Shift+L" data-mac-shortcut="⌘+⇧+L" data-event="justifyLeft" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.center + '" data-shortcut="Ctrl+Shift+E" data-mac-shortcut="⌘+⇧+E" data-event="justifyCenter" tabindex="-1"><i class="fa fa-align-center icon-align-center"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.right + '" data-shortcut="Ctrl+Shift+R" data-mac-shortcut="⌘+⇧+R" data-event="justifyRight" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.justify + '" data-shortcut="Ctrl+Shift+J" data-mac-shortcut="⌘+⇧+J" data-event="justifyFull" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="note-list btn-group">' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.outdent + '" data-shortcut="Ctrl+[" data-mac-shortcut="⌘+[" data-event="outdent" tabindex="-1"><i class="fa fa-outdent icon-indent-left"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.indent + '" data-shortcut="Ctrl+]" data-mac-shortcut="⌘+]" data-event="indent" tabindex="-1"><i class="fa fa-indent icon-indent-right"></i></button>' +
          '</li>' +
        '</ul>';
      },
      height: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + locale.font.height + '" tabindex="-1"><i class="fa fa-text-height icon-text-height"></i>&nbsp; <b class="caret"></b></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="lineHeight" data-value="1.0"><i class="fa fa-check icon-ok"></i> 1.0</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.2"><i class="fa fa-check icon-ok"></i> 1.2</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.4"><i class="fa fa-check icon-ok"></i> 1.4</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.5"><i class="fa fa-check icon-ok"></i> 1.5</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.6"><i class="fa fa-check icon-ok"></i> 1.6</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.8"><i class="fa fa-check icon-ok"></i> 1.8</a></li>' +
        '<li><a data-event="lineHeight" data-value="2.0"><i class="fa fa-check icon-ok"></i> 2.0</a></li>' +
        '<li><a data-event="lineHeight" data-value="3.0"><i class="fa fa-check icon-ok"></i> 3.0</a></li>' +
        '</ul>';
      },
      help: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.help + '" data-shortcut="Ctrl+/" data-mac-shortcut="⌘+/" data-event="showHelpDialog" tabindex="-1"><i class="fa fa-question icon-question"></i></button>';
      },
      fullscreen: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.fullscreen + '" data-event="fullscreen" tabindex="-1"><i class="fa fa-arrows-alt icon-fullscreen"></i></button>';
      },
      codeview: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.codeview + '" data-event="codeview" tabindex="-1"><i class="fa fa-code icon-code"></i></button>';
      }
    };
    var sPopover = function(locale) {
      return '<div class="note-popover">' +
                '<div class="note-link-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-link-content">' +
                    '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                    '<div class="note-insert btn-group">' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.edit + '" data-event="showLinkDialog" tabindex="-1"><i class="fa fa-edit icon-edit"></i></button>' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.unlink + '" data-event="unlink" tabindex="-1"><i class="fa fa-unlink icon-unlink"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="note-image-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-image-content">' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resize_full + '" data-event="resize" data-value="1" tabindex="-1"><span class="note-fontsize-10">100%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resize_half + '" data-event="resize" data-value="0.5" tabindex="-1"><span class="note-fontsize-10">50%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resize_quarter + '" data-event="resize" data-value="0.25" tabindex="-1"><span class="note-fontsize-10">25%</span> </button>' +
                    '</div>' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.float_left + '" data-event="floatMe" data-value="left" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.float_right + '" data-event="floatMe" data-value="right" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.float_none + '" data-event="floatMe" data-value="none" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
    };

    var sHandle = '<div class="note-handle">' +
                    '<div class="note-control-selection">' +
                      '<div class="note-control-selection-bg"></div>' +
                      '<div class="note-control-holder note-control-nw"></div>' +
                      '<div class="note-control-holder note-control-ne"></div>' +
                      '<div class="note-control-holder note-control-sw"></div>' +
                      '<div class="note-control-sizing note-control-se"></div>' +
                      '<div class="note-control-selection-info"></div>' +
                    '</div>' +
                  '</div>';

    var sShortcutText = function(locale) {
      return '<table class="note-shortcut">' +
        '<thead>' +
          '<tr><th></th><th>' + locale.shortcut.text_formatting + '</th></tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr><td>⌘ + B</td><td>' + locale.font.bold + '</td></tr>' +
          '<tr><td>⌘ + I</td><td>' + locale.font.italic + '</td></tr>' +
          '<tr><td>⌘ + U</td><td>' + locale.font.underline + '</td></tr>' +
          '<tr><td>⌘ + ⇧ + S</td><td>' + locale.font.strike + '</td></tr>' +
          '<tr><td>⌘ + \\</td><td>' + locale.font.clear + '</td></tr>' +
          '</tr>' +
        '</tbody>' +
      '</table>';
    };

    var sShortcutAction = function(locale) {
      return '<table class="note-shortcut">' +
        '<thead>' +
          '<tr><th></th><th>' + locale.shortcut.action + '</th></tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr><td>⌘ + Z</td><td>' + locale.history.undo + '</td></tr>' +
          '<tr><td>⌘ + ⇧ + Z</td><td>' + locale.history.redo + '</td></tr>' +
          '<tr><td>⌘ + ]</td><td>' + locale.paragraph.indent + '</td></tr>' +
          '<tr><td>⌘ + [</td><td>' + locale.paragraph.outdent + '</td></tr>' +
          '<tr><td>⌘ + K</td><td>' + locale.link.insert + '</td></tr>' +
          '<tr><td>⌘ + ENTER</td><td>' + locale.hr.insert + '</td></tr>' +
        '</tbody>' +
      '</table>';
    };

    var sShortcutPara = function(locale) {
      return '<table class="note-shortcut">' +
                '<thead>' +
                  '<tr><th></th><th>' + locale.shortcut.paragraph_formatting + '</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>⌘ + ⇧ + L</td><td>' + locale.paragraph.left + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + E</td><td>' + locale.paragraph.center + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + R</td><td>' + locale.paragraph.right + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + J</td><td>' + locale.paragraph.justify + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM7</td><td>' + locale.lists.ordered + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM8</td><td>' + locale.lists.unordered + '</td></tr>' +
                '</tbody>' +
              '</table>';
    };

    var sShortcutStyle = function(locale) {
      return '<table class="note-shortcut">' +
                '<thead>' +
                  '<tr><th></th><th>' + locale.shortcut.document_style + '</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>⌘ + NUM0</td><td>' + locale.style.normal + '</td></tr>' +
                  '<tr><td>⌘ + NUM1</td><td>' + locale.style.h1 + '</td></tr>' +
                  '<tr><td>⌘ + NUM2</td><td>' + locale.style.h2 + '</td></tr>' +
                  '<tr><td>⌘ + NUM3</td><td>' + locale.style.h3 + '</td></tr>' +
                  '<tr><td>⌘ + NUM4</td><td>' + locale.style.h4 + '</td></tr>' +
                  '<tr><td>⌘ + NUM5</td><td>' + locale.style.h5 + '</td></tr>' +
                  '<tr><td>⌘ + NUM6</td><td>' + locale.style.h6 + '</td></tr>' +
                '</tbody>' +
              '</table>';
    };

    var sShortcutTable = function(locale) {
      return '<table class="note-shortcut-layout">' +
                '<tbody>' +
                  '<tr><td>' + sShortcutAction(locale) + '</td><td>' + sShortcutText(locale) + '</td></tr>' +
                  '<tr><td>' + sShortcutStyle(locale) + '</td><td>' + sShortcutPara(locale) + '</td></tr>' +
                '</tbody>' +
              '</table>';
    };

    var replaceMacKeys = function (sHtml) {
        return sHtml.replace(/⌘/g, 'Ctrl').replace(/⇧/g, 'Shift');
    };

    var sDialog = function(locale) {
      return '<div class="note-dialog">' +
                '<div class="note-image-dialog modal" aria-hidden="false">' +
                  '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                      '<div class="modal-header">' +
                        '<button type="button" class="close" aria-hidden="true" tabindex="-1">×</button>' +
                        '<h4>' + locale.image.insert + '</h4>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<div class="row-fluid">' +
                          '<div class="note-dropzone span12">' + locale.image.drag_image_here + '</div>' +
                          '<h5>' + locale.image.select_from_files + '</h5>' +
                          '<input class="note-image-input" type="file" name="files" accept="image/*" capture="camera" />' +
                          '<h5>' + locale.image.url + '</h5>' +
                          '<input class="note-image-url form-control span12" type="text" />' +
                        '</div>' +
                      '</div>' +
                      '<div class="modal-footer">' +
                        '<button href="#" class="btn btn-primary note-image-btn disabled" disabled="disabled">' + locale.image.insert + '</button>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="note-link-dialog modal" aria-hidden="false">' +
                  '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                      '<div class="modal-header">' +
                        '<button type="button" class="close" aria-hidden="true" tabindex="-1">×</button>' +
                        '<h4>' + locale.link.insert + '</h4>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<div class="row-fluid">' +

                        '<div class="form-group">' +
                          '<label>' + locale.link.text_to_display + '</label>' +
                          '<span class="note-link-text form-control input-xlarge uneditable-input" />' +
                        '</div>' +
                        '<div class="form-group">' +
                          '<label>' + locale.link.url + '</label>' +
                          '<input class="note-link-url form-control span12" type="text" />' +
                        '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="modal-footer">' +
                        '<button href="#" class="btn btn-primary note-link-btn disabled" disabled="disabled">' + locale.link.insert + '</button>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="note-help-dialog modal" aria-hidden="false">' +
                  '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                      '<div class="modal-body">' +
                        '<div class="modal-background">' +
                        '<a class="modal-close pull-right" aria-hidden="true" tabindex="-1">' + locale.shortcut.close + '</a>' +
                        '<div class="title">' + locale.shortcut.shortcuts + '</div>' +
                        (agent.bMac ? sShortcutTable(locale) : replaceMacKeys(sShortcutTable(locale))) +
                        '<p class="text-center"><a href="//hackerwins.github.io/summernote/" target="_blank">Summernote v0.4</a> · <a href="//github.com/HackerWins/summernote" target="_blank">Project</a> · <a href="//github.com/HackerWins/summernote/issues" target="_blank">Issues</a></p>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
    };

    var sStatusbar = '<div class="note-resizebar"><div class="note-icon-bar"></div><div class="note-icon-bar"></div><div class="note-icon-bar"></div></div>';
    /* jshint ignore:end */

    // createTooltip
    var createTooltip = function ($container, sPlacement) {
      $container.find('button').each(function (i, elBtn) {
        var $btn = $(elBtn);
        var sShortcut = $btn.attr(agent.bMac ? 'data-mac-shortcut': 'data-shortcut');
        if (sShortcut) { $btn.attr('title', function (i, v) { return v + ' (' + sShortcut + ')'; }); }
      //bootstrap tooltip on btn-group bug: https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({container: 'body', placement: sPlacement || 'top'});
    };

    // pallete colors
    var aaColor = [
      ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
      ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
      ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
      ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
      ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
      ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
      ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
      ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
    ];

    // createPalette
    var createPalette = function ($container) {
      $container.find('.note-color-palette').each(function () {
        var $palette = $(this), sEvent = $palette.attr('data-target-event');
        var sPaletteContents = '';
        for (var row = 0, szRow = aaColor.length; row < szRow; row++) {
          var aColor = aaColor[row];
          var sLine = '<div>';
          for (var col = 0, szCol = aColor.length; col < szCol; col++) {
            var sColor = aColor[col];
            var sButton = ['<button type="button" class="note-color-btn" style="background-color:', sColor,
                           ';" data-event="', sEvent,
                           '" data-value="', sColor,
                           '" title="', sColor,
                           '" data-toggle="button" tabindex="-1"></button>'].join('');
            sLine += sButton;
          }
          sLine += '</div>';
          sPaletteContents += sLine;
        }
        $palette.html(sPaletteContents);
      });
    };

    // createLayout
    this.createLayout = function ($holder, options) {
      var nHeight = options.height,
          nTabsize = options.tabsize,
          aToolbarSetting = options.toolbar;

      //already created
      if ($holder.next().hasClass('note-editor')) { return; }

      //01. create Editor
      var $editor = $('<div class="note-editor"></div>');
      $editor.data('options', options);

      //02. statusbar
      if (nHeight > 0) {
        $('<div class="note-statusbar">' + sStatusbar + '</div>').prependTo($editor);
      }

      //03. create Editable
      var $editable = $('<div class="note-editable" contentEditable="true"></div>').prependTo($editor);
      if (nHeight) {
        $editable.height(nHeight);
        $editable.data('optionHeight', nHeight);
      }
      if (nTabsize) {
        $editable.data('tabsize', nTabsize);
      }

      $editable.html(dom.html($holder) || dom.emptyPara);
      $editable.data('NoteHistory', new History());

      //031. create codable
      $('<textarea class="note-codable"></textarea>').prependTo($editor);

      //032. set styleWithCSS for backColor / foreColor clearing with 'inherit'.
      setTimeout(function () { // protect FF Error: NS_ERROR_FAILURE: Failure
        document.execCommand('styleWithCSS', 0, true);
      });

      //04. create Toolbar
      var sToolbar = '';
      for (var idx = 0, sz = aToolbarSetting.length; idx < sz; idx ++) {
        var group = aToolbarSetting[idx];
        sToolbar += '<div class="note-' + group[0] + ' btn-group">';
        for (var i = 0, szGroup = group[1].length; i < szGroup; i++) {
          sToolbar += aToolbarItem[group[1][i]](Locale[options.locale]);
        }
        sToolbar += '</div>';
      }

      sToolbar = '<div class="note-toolbar btn-toolbar">' + sToolbar + '</div>';

      var $toolbar = $(sToolbar).prependTo($editor);
      createPalette($toolbar);
      createTooltip($toolbar, 'bottom');

      //05. create Popover
      var $popover = $(sPopover(Locale[options.locale])).prependTo($editor);
      createTooltip($popover);

      //06. handle(control selection, ...)
      $(sHandle).prependTo($editor);

      //07. create Dialog
      var $dialog = $(sDialog(Locale[options.locale])).prependTo($editor);
      $dialog.find('button.close, a.modal-close').click(function () {
        $(this).closest('.modal').modal('hide');
      });

      //08. Editor/Holder switch
      $editor.insertAfter($holder);
      $holder.hide();
    };

    // layoutInfoFromHolder
    var layoutInfoFromHolder = this.layoutInfoFromHolder = function ($holder) {
      var $editor = $holder.next();
      if (!$editor.hasClass('note-editor')) { return; }

      return {
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar'),
        popover: $editor.find('.note-popover'),
        handle: $editor.find('.note-handle'),
        dialog: $editor.find('.note-dialog')
      };
    };

    // removeLayout
    this.removeLayout = function ($holder) {
      var info = layoutInfoFromHolder($holder);
      if (!info) { return; }
      $holder.html(info.editable.html());

      info.editor.remove();
      $holder.show();
    };
  };

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * extend jquery fn
   */
  $.fn.extend({
    // create Editor Layout and attach Key and Mouse Event
    summernote: function (options) {
      options = $.extend({
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']],
          ['help', ['help']]
        ],
        locale: 'en-US'
      }, options);

      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        // createLayout with options
        renderer.createLayout($holder, options);

        var info = renderer.layoutInfoFromHolder($holder);
        eventHandler.attach(info, options);

        // Textarea auto filling the code before form submit.
        if (dom.isTextarea($holder[0])) {
          $holder.closest('form').submit(function () {
            $holder.html($holder.code());
          });
        }
      });

      if (this.first() && options.focus) { // focus on first editable element
        var info = renderer.layoutInfoFromHolder(this.first());
        info.editable.focus();
      }
      if (this.length > 0 && options.oninit) { // callback on init
        options.oninit();
      }
    },
    // get the HTML contents of note or set the HTML contents of note.
    code: function (sHTML) {
      //get the HTML contents
      if (sHTML === undefined) {
        var $holder = this.first();
        if ($holder.length === 0) { return; }
        var info = renderer.layoutInfoFromHolder($holder);
        if (!!(info && info.editable)) {
          var bCodeview = info.editor.hasClass('codeview');
          if (agent.bCodeMirror) {
            info.codable.data('cmEditor').save();
          }
          return bCodeview ? info.codable.val() : info.editable.html();
        }
        return $holder.html();
      }

      // set the HTML contents
      this.each(function (i, elHolder) {
        var info = renderer.layoutInfoFromHolder($(elHolder));
        if (info && info.editable) { info.editable.html(sHTML); }
      });
    },
    // destroy Editor Layout and dettach Key and Mouse Event
    destroy: function () {
      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        var info = renderer.layoutInfoFromHolder($holder);
        if (!info || !info.editable) { return; }
        eventHandler.dettach(info);
        renderer.removeLayout($holder);
      });
    },
    // inner object for test
    summernoteInner: function () {
      return { dom: dom, list: list, func: func, range: range };
    }
  });
})(window.jQuery, window.CodeMirror); // jQuery, CodeMirror

// Array.prototype.reduce fallback
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, optInitialValue) {
    'use strict';
    var idx, value, length = this.length >>> 0, isValueSet = false;
    if (1 < arguments.length) {
      value = optInitialValue;
      isValueSet = true;
    }
    for (idx = 0; length > idx; ++idx) {
      if (this.hasOwnProperty(idx)) {
        if (isValueSet) {
          value = callback(value, this[idx], idx, this);
        } else {
          value = this[idx];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}
