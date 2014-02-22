define([
  'core/func', 'core/list', 'core/dom'
], function (func, list, dom) {
  /**
   * range module
   */
  var range = (function () {
    var bW3CRangeSupport = !!document.createRange;
     
    /**
     * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
     * @param {TextRange} textRange
     * @param {Boolean} bStart
     * @return {BoundaryPoint}
     */
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
    
    /**
     * return TextRange from boundary point (inspired by google closure-library)
     * @param {BoundaryPoint} bp
     * @return {TextRange}
     */
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
    
    /**
     * Wrapped Range
     *
     * @param {Element} sc - start container
     * @param {Number} so - start offset
     * @param {Element} ec - end container
     * @param {Number} eo - end offset
     */
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

      /**
       * select update visible range
       */
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

      /**
       * returns matched nodes on range
       *
       * @param {Function} pred - predicate function
       * @return {Element[]}
       */
      this.nodes = function (pred) {
        var aNode = dom.listBetween(sc, ec);
        var aMatched = list.compact($.map(aNode, function (node) {
          return dom.ancestor(node, pred);
        }));
        return $.map(list.clusterBy(aMatched, func.eq2), list.head);
      };

      /**
       * returns commonAncestor of range
       * @return {Element} - commonAncestor
       */
      this.commonAncestor = function () {
        return dom.commonAncestor(sc, ec);
      };
      
      /**
       * makeIsOn: return isOn(pred) function
       */
      var makeIsOn = function (pred) {
        return function () {
          var elAncestor = dom.ancestor(sc, pred);
          return !!elAncestor && (elAncestor === dom.ancestor(ec, pred));
        };
      };
  
      // isOnEditable: judge whether range is on editable or not
      this.isOnEditable = makeIsOn(dom.isEditable);
      // isOnList: judge whether range is on list node or not
      this.isOnList = makeIsOn(dom.isList);
      // isOnAnchor: judge whether range is on anchor node or not
      this.isOnAnchor = makeIsOn(dom.isAnchor);
      // isOnAnchor: judge whether range is on cell node or not
      this.isOnCell = makeIsOn(dom.isCell);
      // isCollapsed: judge whether range was collapsed
      this.isCollapsed = function () { return sc === ec && so === eo; };

      /**
       * insert node at current cursor
       * @param {Element} node
       */
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
  
      // bookmark: offsetPath bookmark
      this.bookmark = function (elEditable) {
        return {
          s: { path: dom.makeOffsetPath(elEditable, sc), offset: so },
          e: { path: dom.makeOffsetPath(elEditable, ec), offset: eo }
        };
      };
    };
  
    return {
      /**
       * create Range Object From arguments or Browser Selection
       *
       * @param {Element} sc - start container
       * @param {Number} so - start offset
       * @param {Element} ec - end container
       * @param {Number} eo - end offset
       */
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

      /**
       * create WrappedRange from node
       *
       * @param {Element} node
       * @return {WrappedRange}
       */
      createFromNode: function (node) {
        return this.create(node, 0, node, 1);
      },

      /**
       * create WrappedRange from Bookmark
       *
       * @param {Element} elEditable
       * @param {Obkect} bookmark
       * @return {WrappedRange}
       */
      createFromBookmark : function (elEditable, bookmark) {
        var sc = dom.fromOffsetPath(elEditable, bookmark.s.path);
        var so = bookmark.s.offset;
        var ec = dom.fromOffsetPath(elEditable, bookmark.e.path);
        var eo = bookmark.e.offset;
        return new WrappedRange(sc, so, ec, eo);
      }
    };
  })();

  return range;
});
