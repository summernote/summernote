/**
 * Super simple wysiwyg editor on Bootstrap v0.5.1
 * http://hackerwins.github.io/summernote/
 *
 * summernote.js
 * Copyright 2013 Alan Hong. and outher contributors
 * summernote may be freely distributed under the MIT license./
 *
 * Date: 2014-03-16T06:23Z
 */
(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'codemirror'], factory);
  } else {
    // Browser globals: jQuery, CodeMirror
    factory(window.jQuery, window.CodeMirror);
  }
}(function ($, CodeMirror) {
  


  if ('function' !== typeof Array.prototype.reduce) {
    /**
     * Array.prototype.reduce fallback
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    Array.prototype.reduce = function (callback, optInitialValue) {
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

  /**
   * Object which check platform and agent
   */
  var agent = {
    bMac: navigator.appVersion.indexOf('Mac') > -1,
    bMSIE: navigator.userAgent.indexOf('MSIE') > -1,
    bFF: navigator.userAgent.indexOf('Firefox') > -1,
    jqueryVersion: parseFloat($.fn.jquery),
    bCodeMirror: !!CodeMirror
  };

  /**
   * func utils (for high-order func's arg)
   */
  var func = (function () {
    var eq = function (elA) {
      return function (elB) {
        return elA === elB;
      };
    };

    var eq2 = function (elA, elB) {
      return elA === elB;
    };

    var ok = function () {
      return true;
    };

    var fail = function () {
      return false;
    };

    var not = function (f) {
      return function () {
        return !f.apply(f, arguments);
      };
    };

    var self = function (a) {
      return a;
    };

    return {
      eq: eq,
      eq2: eq2,
      ok: ok,
      fail: fail,
      not: not,
      self: self
    };
  })();

  /**
   * list utils
   */
  var list = (function () {
    /**
     * returns the first element of an array.
     * @param {Array} array
     */
    var head = function (array) {
      return array[0];
    };

    /**
     * returns the last element of an array.
     * @param {Array} array
     */
    var last = function (array) {
      return array[array.length - 1];
    };

    /**
     * returns everything but the last entry of the array.
     * @param {Array} array
     */
    var initial = function (array) {
      return array.slice(0, array.length - 1);
    };

    /**
     * returns the rest of the elements in an array.
     * @param {Array} array
     */
    var tail = function (array) {
      return array.slice(1);
    };

    /**
     * returns next item.
     * @param {Array} array
     */
    var next = function (array, item) {
      var idx = array.indexOf(item);
      if (idx === -1) { return null; }

      return array[idx + 1];
    };

    /**
     * returns prev item.
     * @param {Array} array
     */
    var prev = function (array, item) {
      var idx = array.indexOf(item);
      if (idx === -1) { return null; }

      return array[idx - 1];
    };
  
    /**
     * get sum from a list
     * @param {Array} array - array
     * @param {Function} fn - iterator
     */
    var sum = function (array, fn) {
      fn = fn || func.self;
      return array.reduce(function (memo, v) {
        return memo + fn(v);
      }, 0);
    };
  
    /**
     * returns a copy of the collection with array type.
     * @param {Collection} collection - collection eg) node.childNodes, ...
     */
    var from = function (collection) {
      var result = [], idx = -1, length = collection.length;
      while (++idx < length) {
        result[idx] = collection[idx];
      }
      return result;
    };
  
    /**
     * cluster elements by predicate function.
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     * @param {Array[]}
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
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     */
    var compact = function (array) {
      var aResult = [];
      for (var idx = 0, sz = array.length; idx < sz; idx ++) {
        if (array[idx]) { aResult.push(array[idx]); }
      }
      return aResult;
    };
  
    return { head: head, last: last, initial: initial, tail: tail,
             prev: prev, next: next, sum: sum, from: from,
             compact: compact, clusterBy: clusterBy };
  })();

  /**
   * Dom functions
   */
  var dom = (function () {
    /**
     * returns whether node is `note-editable` or not.
     *
     * @param {Element} node
     * @return {Boolean}
     */
    var isEditable = function (node) {
      return node && $(node).hasClass('note-editable');
    };
  
    var isControlSizing = function (node) {
      return node && $(node).hasClass('note-control-sizing');
    };

    /**
     * build layoutInfo from $editor(.note-editor)
     *
     * @param {jQuery} $editor
     * @return {Object}
     */
    var buildLayoutInfo = function ($editor) {
      var makeFinder = function (sClassName) {
        return function () { return $editor.find(sClassName); };
      };
      return {
        editor: function () { return $editor; },
        dropzone: makeFinder('.note-dropzone'),
        toolbar: makeFinder('.note-toolbar'),
        editable: makeFinder('.note-editable'),
        codable: makeFinder('.note-codable'),
        statusbar: makeFinder('.note-statusbar'),
        popover: makeFinder('.note-popover'),
        handle: makeFinder('.note-handle'),
        dialog: makeFinder('.note-dialog')
      };
    };

    /**
     * returns predicate which judge whether nodeName is same
     * @param {String} sNodeName
     */
    var makePredByNodeName = function (sNodeName) {
      // nodeName is always uppercase.
      return function (node) {
        return node && node.nodeName === sNodeName;
      };
    };
  
    var isPara = function (node) {
      // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
      return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName);
    };
  
    var isList = function (node) {
      return node && /^UL|^OL/.test(node.nodeName);
    };

    var isCell = function (node) {
      return node && /^TD|^TH/.test(node.nodeName);
    };
  
    /**
     * find nearest ancestor predicate hit
     *
     * @param {Element} node
     * @param {Function} pred - predicate function
     */
    var ancestor = function (node, pred) {
      while (node) {
        if (pred(node)) { return node; }
        if (isEditable(node)) { break; }

        node = node.parentNode;
      }
      return null;
    };
  
    /**
     * returns new array of ancestor nodes (until predicate hit).
     *
     * @param {Element} node
     * @param {Function} [optional] pred - predicate function
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
     *
     * @param {Element} nodeA
     * @param {Element} nodeB
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
     *
     * @param {Element} nodeA
     * @param {Element} nodeB
     */
    var listBetween = function (nodeA, nodeB) {
      var aNode = [];
  
      var bStart = false, bEnd = false;

      // DFS(depth first search) with commonAcestor.
      (function fnWalk(node) {
        if (!node) { return; } // traverse fisnish
        if (node === nodeA) { bStart = true; } // start point
        if (bStart && !bEnd) { aNode.push(node); } // between
        if (node === nodeB) { bEnd = true; return; } // end point

        for (var idx = 0, sz = node.childNodes.length; idx < sz; idx++) {
          fnWalk(node.childNodes[idx]);
        }
      })(commonAncestor(nodeA, nodeB));
  
      return aNode;
    };
  
    /**
     * listing all previous siblings (until predicate hit).
     * @param {Element} node
     * @param {Function} [optional] pred - predicate function
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
     * listing next siblings (until predicate hit).
     *
     * @param {Element} node
     * @param {Function} [pred] - predicate function
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
     * listing descendant nodes
     *
     * @param {Element} node
     * @param {Function} [pred] - predicate function
     */
    var listDescendant = function (node, pred) {
      var aDescendant = [];
      pred = pred || func.ok;

      // start DFS(depth first search) with node
      (function fnWalk(current) {
        if (node !== current && pred(current)) {
          aDescendant.push(current);
        }
        for (var idx = 0, sz = current.childNodes.length; idx < sz; idx++) {
          fnWalk(current.childNodes[idx]);
        }
      })(node);

      return aDescendant;
    };
  
    /**
     * insert node after preceding
     *
     * @param {Element} node
     * @param {Element} preceding - predicate function
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
     * append elements.
     *
     * @param {Element} node
     * @param {Collection} aChild
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
     *
     * @param {Element} node
     */
    var length = function (node) {
      if (isText(node)) { return node.nodeValue.length; }
      return node.childNodes.length;
    };
  
    /**
     * returns offset from parent.
     *
     * @param {Element} node
     */
    var position = function (node) {
      var offset = 0;
      while ((node = node.previousSibling)) { offset += 1; }
      return offset;
    };
  
    /**
     * return offsetPath(array of offset) from ancestor
     *
     * @param {Element} ancestor - ancestor node
     * @param {Element} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var aAncestor = list.initial(listAncestor(node, func.eq(ancestor)));
      return $.map(aAncestor, position).reverse();
    };
  
    /**
     * return element from offsetPath(array of offset)
     *
     * @param {Element} ancestor - ancestor node
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
     *
     * @param {Element} node
     * @param {Number} offset
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
     *
     * @param {Element} root
     * @param {Element} pivot - this will be boundaryPoint's node
     * @param {Number} offset - this will be boundaryPoint's offset
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
     * @param {Element} node
     * @param {Boolean} bRemoveChild
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
      blank: agent.bMSIE ? '&nbsp;' : '<br/>',
      emptyPara: '<p><br/></p>',
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      buildLayoutInfo: buildLayoutInfo,
      isText: isText,
      isPara: isPara,
      isList: isList,
      isTable: makePredByNodeName('TABLE'),
      isCell: isCell,
      isAnchor: makePredByNodeName('A'),
      isDiv: makePredByNodeName('DIV'),
      isLi: makePredByNodeName('LI'),
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
      listDescendant: listDescendant,
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

  var settings = {
    // version
    version: '0.5.1',

    /**
     * options for init
     */
    options: {
      width: null,                  // set editor width
      height: null,                 // set editable height, ex) 300

      focus: false,                 // set focus after initilize summernote

      tabsize: null,                // size of tab ex) 2 or 4
      styleWithSpan: true,          // style with span (Chrome and FF)

      disableLinkTarget: false,     // hide link Target Checkbox
      disableDragAndDrop: false,    // disable drag and drop event

      codemirror: null,             // codemirror options

      // language
      lang: 'en-US',                // language 'en-US', 'ko-KR', ...
      direction: null,              // text direction, ex) 'rtl'

      // default toolbar
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        // ['fontsize', ['fontsize']], Still buggy
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview']],
        ['help', ['help']]
      ],

      // callbacks
      oninit: null,             // initialize
      onfocus: null,            // editable has focus
      onblur: null,             // editable out of focus
      onenter: null,            // enter key pressed
      onkeyup: null,            // keyup
      onkeydown: null,          // keydown
      onImageUpload: null,      // imageUploadHandler
      onImageUploadError: null, // imageUploadErrorHandler
      onToolbarClick: null,

      keyMap: {
        pc: {
          'CTRL+Z': 'undo',
          'CTRL+Y': 'redo',
          'TAB': 'tab',
          'SHIFT+TAB': 'untab',
          'CTRL+B': 'bold',
          'CTRL+I': 'italic',
          'CTRL+U': 'underline',
          'CTRL+SHIFT+S': 'strikethrough',
          'CTRL+BACKSLASH': 'removeFormat',
          'CTRL+SHIFT+L': 'justifyLeft',
          'CTRL+SHIFT+E': 'justifyCenter',
          'CTRL+SHIFT+R': 'justifyRight',
          'CTRL+SHIFT+J': 'justifyFull',
          'CTRL+SHIFT+NUM7': 'insertUnorderedList',
          'CTRL+SHIFT+NUM8': 'insertOrderedList',
          'CTRL+LEFTBRACKET': 'outdent',
          'CTRL+RIGHTBRACKET': 'indent',
          'CTRL+NUM0': 'formatPara',
          'CTRL+NUM1': 'formatH1',
          'CTRL+NUM2': 'formatH2',
          'CTRL+NUM3': 'formatH3',
          'CTRL+NUM4': 'formatH4',
          'CTRL+NUM5': 'formatH5',
          'CTRL+NUM6': 'formatH6',
          'CTRL+ENTER': 'insertHorizontalRule'
        },

        mac: {
          'CMD+Z': 'undo',
          'CMD+SHIFT+Z': 'redo',
          'TAB': 'tab',
          'SHIFT+TAB': 'untab',
          'CMD+B': 'bold',
          'CMD+I': 'italic',
          'CMD+U': 'underline',
          'CMD+SHIFT+S': 'strikethrough',
          'CMD+BACKSLASH': 'removeFormat',
          'CMD+SHIFT+L': 'justifyLeft',
          'CMD+SHIFT+E': 'justifyCenter',
          'CMD+SHIFT+R': 'justifyRight',
          'CMD+SHIFT+J': 'justifyFull',
          'CMD+SHIFT+NUM7': 'insertUnorderedList',
          'CMD+SHIFT+NUM8': 'insertOrderedList',
          'CMD+LEFTBRACKET': 'outdent',
          'CMD+RIGHTBRACKET': 'indent',
          'CMD+NUM0': 'formatPara',
          'CMD+NUM1': 'formatH1',
          'CMD+NUM2': 'formatH2',
          'CMD+NUM3': 'formatH3',
          'CMD+NUM4': 'formatH4',
          'CMD+NUM5': 'formatH5',
          'CMD+NUM6': 'formatH6',
          'CMD+ENTER': 'insertHorizontalRule'
        }
      }
    },

    // default language: en-US
    lang: {
      'en-US': {
        font: {
          bold: 'Bold',
          italic: 'Italic',
          underline: 'Underline',
          strike: 'Strike',
          clear: 'Remove Font Style',
          height: 'Line Height',
          name: 'Font Family',
          size: 'Font Size'
        },
        image: {
          image: 'Picture',
          insert: 'Insert Image',
          resizeFull: 'Resize Full',
          resizeHalf: 'Resize Half',
          resizeQuarter: 'Resize Quarter',
          floatLeft: 'Float Left',
          floatRight: 'Float Right',
          floatNone: 'Float None',
          dragImageHere: 'Drag an image here',
          selectFromFiles: 'Select from files',
          url: 'Image URL',
          remove: 'Remove Image'
        },
        link: {
          link: 'Link',
          insert: 'Insert Link',
          unlink: 'Unlink',
          edit: 'Edit',
          textToDisplay: 'Text to display',
          url: 'To what URL should this link go?',
          openInNewWindow: 'Open in new window'
        },
        video: {
          video: 'Video',
          videoLink: 'Video Link',
          insert: 'Insert Video',
          url: 'Video URL?',
          providers: '(YouTube, Vimeo, Vine, Instagram, or DailyMotion)'
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
          setTransparent: 'Set transparent',
          reset: 'Reset',
          resetToDefault: 'Reset to default'
        },
        shortcut: {
          shortcuts: 'Keyboard shortcuts',
          close: 'Close',
          textFormatting: 'Text formatting',
          action: 'Action',
          paragraphFormatting: 'Paragraph formatting',
          documentStyle: 'Document Style'
        },
        history: {
          undo: 'Undo',
          redo: 'Redo'
        }
      }
    }
  };

  /**
   * Async functions which returns `Promise`
   */
  var async = (function () {
    /**
     * read contents of file as representing URL
     *
     * @param {File} file
     * @return {Promise} - then: sDataUrl
     */
    var readFileAsDataURL = function (file) {
      return $.Deferred(function (deferred) {
        $.extend(new FileReader(), {
          onload: function (e) {
            var sDataURL = e.target.result;
            deferred.resolve(sDataURL);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };
  
    /**
     * create `<image>` from url string
     *
     * @param {String} sUrl
     * @return {Promise} - then: $image
     */
    var createImage = function (sUrl) {
      return $.Deferred(function (deferred) {
        $('<img>').one('load', function () {
          deferred.resolve($(this));
        }).one('error abort', function () {
          deferred.reject($(this));
        }).css({
          display: 'none'
        }).appendTo(document.body).attr('src', sUrl);
      }).promise();
    };

    return {
      readFileAsDataURL: readFileAsDataURL,
      createImage: createImage
    };
  })();

  /**
   * Object for keycodes.
   */
  var key = {
    isEdit: function (keyCode) {
      return [8, 9, 13, 32].indexOf(keyCode) !== -1;
    },
    nameFromCode: {
      '8': 'BACKSPACE',
      '9': 'TAB',
      '13': 'ENTER',
      '32': 'SPACE',

      // Number: 0-9
      '48': 'NUM0',
      '49': 'NUM1',
      '50': 'NUM2',
      '51': 'NUM3',
      '52': 'NUM4',
      '53': 'NUM5',
      '54': 'NUM6',
      '55': 'NUM7',
      '56': 'NUM8',

      // Alphabet: a-z
      '66': 'B',
      '69': 'E',
      '73': 'I',
      '74': 'J',
      '75': 'K',
      '76': 'L',
      '82': 'R',
      '83': 'S',
      '85': 'U',
      '89': 'Y',
      '90': 'Z',

      '191': 'SLASH',
      '219': 'LEFTBRACKET',
      '220': 'BACKSLASH',
      '221': 'RIGHTBRACKET'
    }
  };

  /**
   * Style
   * @class
   */
  var Style = function () {
    /**
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     * (compability with version < 1.9)
     *
     * @param  {jQuery} $obj
     * @param  {Array} propertyNames - An array of one or more CSS properties.
     * @returns {Object}
     */
    var jQueryCSS = function ($obj, propertyNames) {
      if (agent.jqueryVersion < 1.9) {
        var result = {};
        $.each(propertyNames, function (idx, propertyName) {
          result[propertyName] = $obj.css(propertyName);
        });
        return result;
      }
      return $obj.css.call($obj, propertyNames);
    };

    /**
     * paragraph level style
     *
     * @param {WrappedRange} rng
     * @param {Object} oStyle
     */
    this.stylePara = function (rng, oStyle) {
      $.each(rng.nodes(dom.isPara), function (idx, elPara) {
        $(elPara).css(oStyle);
      });
    };

    /**
     * get current style on cursor
     *
     * @param {WrappedRange} rng
     * @param {Element} elTarget - target element on event
     * @return {Object} - object contains style properties.
     */
    this.current = function (rng, elTarget) {
      var $cont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
      var oStyle = jQueryCSS($cont, properties) || {};

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

  /**
   * Table
   * @class
   */
  var Table = function () {
    /**
     * handle tab key
     *
     * @param {WrappedRange} rng
     * @param {Boolean} bShift
     */
    this.tab = function (rng, bShift) {
      var elCell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var elTable = dom.ancestor(elCell, dom.isTable);
      var aCell = dom.listDescendant(elTable, dom.isCell);

      var elNext = list[bShift ? 'prev' : 'next'](aCell, elCell);
      if (elNext) {
        range.create(elNext, 0).select();
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} nRow
     * @param {Number} nCol
     */
    this.createTable = function (nCol, nRow) {
      var aTD = [], sTD;
      for (var idxCol = 0; idxCol < nCol; idxCol++) {
        aTD.push('<td>' + dom.blank + '</td>');
      }
      sTD = aTD.join('');

      var aTR = [], sTR;
      for (var idxRow = 0; idxRow < nRow; idxRow++) {
        aTR.push('<tr>' + sTD + '</tr>');
      }
      sTR = aTR.join('');
      var sTable = '<table class="table table-bordered">' + sTR + '</table>';

      return $(sTable)[0];
    };
  };

  /**
   * Editor
   * @class
   */
  var Editor = function () {

    var style = new Style();
    var table = new Table();

    /**
     * save current range
     *
     * @param {jQuery} $editable
     */
    this.saveRange = function ($editable) {
      $editable.data('range', range.create());
    };

    /**
     * restore lately range
     *
     * @param {jQuery} $editable
     */
    this.restoreRange = function ($editable) {
      var rng = $editable.data('range');
      if (rng) { rng.select(); }
    };

    /**
     * current style
     * @param {Element} elTarget
     */
    this.currentStyle = function (elTarget) {
      var rng = range.create();
      return rng.isOnEditable() && style.current(rng, elTarget);
    };

    /**
     * undo
     * @param {jQuery} $editable
     */
    this.undo = function ($editable) {
      $editable.data('NoteHistory').undo($editable);
    };

    /**
     * redo
     * @param {jQuery} $editable
     */
    this.redo = function ($editable) {
      $editable.data('NoteHistory').redo($editable);
    };

    /**
     * record Undo
     * @param {jQuery} $editable
     */
    var recordUndo = this.recordUndo = function ($editable) {
      $editable.data('NoteHistory').recordUndo($editable);
    };

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var aCmd = ['bold', 'italic', 'underline', 'strikethrough',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                'insertOrderedList', 'insertUnorderedList',
                'indent', 'outdent', 'formatBlock', 'removeFormat',
                'backColor', 'foreColor', 'insertHorizontalRule', 'fontName'];

    for (var idx = 0, len = aCmd.length; idx < len; idx ++) {
      this[aCmd[idx]] = (function (sCmd) {
        return function ($editable, sValue) {
          recordUndo($editable);
          document.execCommand(sCmd, false, sValue);
        };
      })(aCmd[idx]);
    }
    /* jshint ignore:end */

    /**
     * @param {jQuery} $editable 
     * @param {WrappedRange} rng
     * @param {Number} nTabsize
     */
    var insertTab = function ($editable, rng, nTabsize) {
      recordUndo($editable);
      var sNbsp = new Array(nTabsize + 1).join('&nbsp;');
      rng.insertNode($('<span id="noteTab">' + sNbsp + '</span>')[0]);
      var $tab = $('#noteTab').removeAttr('id');
      rng = range.create($tab[0], 1);
      rng.select();
      dom.remove($tab[0]);
    };

    /**
     * handle tab key
     * @param {jQuery} $editable 
     * @param {Number} nTabsize
     * @param {Boolean} bShift
     */
    this.tab = function ($editable, options) {
      var rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng);
      } else {
        insertTab($editable, rng, options.tabsize);
      }
    };

    /**
     * handle shift+tab key
     */
    this.untab = function () {
      var rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng, true);
      }
    };

    /**
     * insert image
     *
     * @param {jQuery} $editable
     * @param {String} sUrl
     */
    this.insertImage = function ($editable, sUrl) {
      async.createImage(sUrl).then(function ($image) {
        recordUndo($editable);
        $image.css({
          display: '',
          width: Math.min($editable.width(), $image.width())
        });
        range.create().insertNode($image[0]);
      }).fail(function () {
        var callbacks = $editable.data('callbacks');
        if (callbacks.onImageUploadError) {
          callbacks.onImageUploadError();
        }
      });
    };

    /**
     * insert video
     * @param {jQuery} $editable
     * @param {String} sUrl
     */
    this.insertVideo = function ($editable, sUrl) {
      recordUndo($editable);

      // video url patterns(youtube, instagram, vimeo, dailymotion)
      var ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var ytMatch = sUrl.match(ytRegExp);

      var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9]*)/;
      var igMatch = sUrl.match(igRegExp);

      var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
      var vMatch = sUrl.match(vRegExp);

      var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      var vimMatch = sUrl.match(vimRegExp);

      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = sUrl.match(dmRegExp);

      var $video;
      if (ytMatch && ytMatch[2].length === 11) {
        var youtubeId = ytMatch[2];
        $video = $('<iframe>')
          .attr('src', '//www.youtube.com/embed/' + youtubeId)
          .attr('width', '640').attr('height', '360');
      } else if (igMatch && igMatch[0].length > 0) {
        $video = $('<iframe>')
          .attr('src', igMatch[0] + '/embed/')
          .attr('width', '612').attr('height', '710')
          .attr('scrolling', 'no')
          .attr('allowtransparency', 'true');
      } else if (vMatch && vMatch[0].length > 0) {
        $video = $('<iframe>')
          .attr('src', vMatch[0] + '/embed/simple')
          .attr('width', '600').attr('height', '600')
          .attr('class', 'vine-embed');
      } else if (vimMatch && vimMatch[3].length > 0) {
        $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
          .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
          .attr('width', '640').attr('height', '360');
      } else if (dmMatch && dmMatch[2].length > 0) {
        $video = $('<iframe>')
          .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
          .attr('width', '640').attr('height', '360');
      } else {
        // this is not a known video link. Now what, Cat? Now what?
      }

      if ($video) {
        $video.attr('frameborder', 0);
        range.create().insertNode($video[0]);
      }
    };

    /**
     * formatBlock
     *
     * @param {jQuery} $editable
     * @param {String} sTagName
     */
    this.formatBlock = function ($editable, sTagName) {
      recordUndo($editable);
      sTagName = agent.bMSIE ? '<' + sTagName + '>' : sTagName;
      document.execCommand('FormatBlock', false, sTagName);
    };

    this.formatPara = function ($editable) {
      this.formatBlock($editable, 'P');
    };

    /* jshint ignore:start */
    for (var idx = 1; idx <= 6; idx ++) {
      this['formatH' + idx] = function (idx) {
        return function ($editable) {
          this.formatBlock($editable, 'H' + idx);
        };
      }(idx);
    };
    /* jshint ignore:end */

    /**
     * fontsize
     * FIXME: Still buggy
     *
     * @param {jQuery} $editable
     * @param {String} sValue - px
     */
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

    /**
     * lineHeight
     * @param {jQuery} $editable
     * @param {String} sValue
     */
    this.lineHeight = function ($editable, sValue) {
      recordUndo($editable);
      style.stylePara(range.create(), {lineHeight: sValue});
    };

    /**
     * unlink
     * @param {jQuery} $editable
     */
    this.unlink = function ($editable) {
      var rng = range.create();
      if (rng.isOnAnchor()) {
        recordUndo($editable);
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(elAnchor);
        rng.select();
        document.execCommand('unlink');
      }
    };

    /**
     * create link
     *
     * @param {jQuery} $editable
     * @param {String} sLinkUrl
     * @param {Boolean} bNewWindow
     */
    this.createLink = function ($editable, sLinkUrl, bNewWindow) {
      var rng = range.create();
      recordUndo($editable);

      // protocol
      var sLinkUrlWithProtocol = sLinkUrl;
      if (sLinkUrl.indexOf('@') !== -1 && sLinkUrl.indexOf(':') === -1) {
        sLinkUrlWithProtocol =  'mailto:' + sLinkUrl;
      } else if (sLinkUrl.indexOf('://') === -1) {
        sLinkUrlWithProtocol = 'http://' + sLinkUrl;
      }

      // createLink when range collapsed (IE, Firefox).
      if ((agent.bMSIE || agent.bFF) && rng.isCollapsed()) {
        rng.insertNode($('<A id="linkAnchor">' + sLinkUrl + '</A>')[0]);
        var $anchor = $('#linkAnchor').attr('href', sLinkUrlWithProtocol).removeAttr('id');
        rng = range.createFromNode($anchor[0]);
        rng.select();
      } else {
        document.execCommand('createlink', false, sLinkUrlWithProtocol);
        rng = range.create();
      }

      // target
      $.each(rng.nodes(dom.isAnchor), function (idx, elAnchor) {
        if (bNewWindow) {
          $(elAnchor).attr('target', '_blank');
        } else {
          $(elAnchor).removeAttr('target');
        }
      });
    };

    /**
     * get link info
     *
     * @return {Promise}
     */
    this.getLinkInfo = function () {
      var rng = range.create();
      var bNewWindow = true;
      var sUrl = '';

      // If range on anchor expand range on anchor(for edit link).
      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(elAnchor);
        bNewWindow = $(elAnchor).attr('target') === '_blank';
        sUrl = elAnchor.href;
      }

      return {
        text: rng.toString(),
        url: sUrl,
        newWindow: bNewWindow
      };
    };

    /**
     * get video info
     *
     * @return {Object}
     */
    this.getVideoInfo = function () {
      var rng = range.create();

      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(elAnchor);
      }

      return {
        text: rng.toString()
      };
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
      range.create().insertNode(table.createTable(aDim[0], aDim[1]));
    };

    /**
     * @param {jQuery} $editable
     * @param {String} sValue
     * @param {jQuery} $target
     */
    this.floatMe = function ($editable, sValue, $target) {
      recordUndo($editable);
      $target.css('float', sValue);
    };

    /**
     * resize overlay element
     * @param {jQuery} $editable
     * @param {String} sValue
     * @param {jQuery} $target - target element
     */
    this.resize = function ($editable, sValue, $target) {
      recordUndo($editable);

      $target.css({
        width: $editable.width() * sValue + 'px',
        height: ''
      });
    };

    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [bKeepRatio] - keep ratio
     */
    this.resizeTo = function (pos, $target, bKeepRatio) {
      var szImage;
      if (bKeepRatio) {
        var newRatio = pos.y / pos.x;
        var ratio = $target.data('ratio');
        szImage = {
          width: ratio > newRatio ? pos.x : pos.y / ratio,
          height: ratio > newRatio ? pos.x * ratio : pos.y
        };
      } else {
        szImage = {
          width: pos.x,
          height: pos.y
        };
      }

      $target.css(szImage);
    };

    /**
     * remove media object
     *
     * @param {jQuery} $editable
     * @param {String} sValue - dummy argument (for keep interface)
     * @param {jQuery} $target - target element
     */
    this.removeMedia = function ($editable, sValue, $target) {
      recordUndo($editable);
      $target.detach();
    };
  };

  /**
   * History
   * @class
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
   * Toolbar
   */
  var Toolbar = function () {
    /**
     * update button status
     *
     * @param {jQuery} $toolbar
     * @param {Object} oStyle
     */
    this.update = function ($toolbar, oStyle) {

      /**
       * handle dropdown's check mark (for fontname, fontsize, lineHeight).
       * @param {jQuery} $btn
       * @param {Number} nValue
       */
      var checkDropdownMenu = function ($btn, nValue) {
        $btn.find('.dropdown-menu li a').each(function () {
          // always compare string to avoid creating another func.
          var bChecked = ($(this).data('value') + '') === (nValue + '');
          this.className = bChecked ? 'checked' : '';
        });
      };

      /**
       * update button state(active or not).
       *
       * @param {String} sSelector
       * @param {Function} pred
       */
      var btnState = function (sSelector, pred) {
        var $btn = $toolbar.find(sSelector);
        $btn.toggleClass('active', pred());
      };

      // fontname
      var $fontname = $toolbar.find('.note-fontname');
      if ($fontname.length > 0) {
        var selectedFont = oStyle['font-family'];
        if (!!selectedFont) {
          selectedFont = list.head(selectedFont.split(','));
          selectedFont = selectedFont.replace(/\'/g, '');
          $fontname.find('.note-current-fontname').text(selectedFont);
          checkDropdownMenu($fontname, selectedFont);
        }
      }

      // fontsize
      var $fontsize = $toolbar.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').text(oStyle['font-size']);
      checkDropdownMenu($fontsize, parseFloat(oStyle['font-size']));

      // lineheight
      var $lineHeight = $toolbar.find('.note-height');
      checkDropdownMenu($lineHeight, parseFloat(oStyle['line-height']));

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

    /**
     * update recent color
     *
     * @param {Element} elBtn
     * @param {String} sEvent
     * @param {sValue} sValue
     */
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
      $btn.toggleClass('active', bFullscreen);
    };

    this.updateCodeview = function ($toolbar, bCodeview) {
      var $btn = $toolbar.find('button[data-event="codeview"]');
      $btn.toggleClass('active', bCodeview);
    };

    /**
     * activate buttons exclude codeview
     * @param {jQuery} $toolbar
     */
    this.activate = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').removeClass('disabled');
    };

    /**
     * deactivate buttons exclude codeview
     * @param {jQuery} $toolbar
     */
    this.deactivate = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').addClass('disabled');
    };
  };

  /**
   * Popover (http://getbootstrap.com/javascript/#popovers)
   */
  var Popover = function () {
    /**
     * show popover
     * @param {jQuery} popover
     * @param {Element} elPlaceholder - placeholder for popover
     */
    var showPopover = function ($popover, elPlaceholder) {
      var $placeholder = $(elPlaceholder);
      var pos = $placeholder.position(), height = $placeholder.height();

      // display popover below placeholder.
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top + height
      });
    };

    /**
     * update current state
     * @param {jQuery} $popover - popover container
     * @param {Object} oStyle - style object
     */
    this.update = function ($popover, oStyle) {
      var $linkPopover = $popover.find('.note-link-popover');

      if (oStyle.anchor) {
        var $anchor = $linkPopover.find('a');
        $anchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        showPopover($linkPopover, oStyle.anchor);
      } else {
        $linkPopover.hide();
      }

      var $imagePopover = $popover.find('.note-image-popover');
      if (oStyle.image) {
        showPopover($imagePopover, oStyle.image);
      } else {
        $imagePopover.hide();
      }
    };

    /**
     * hide all popovers
     * @param {jQuery} $popover - popover contaienr
     */
    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  /**
   * Handle
   */
  var Handle = function () {
    /**
     * update handle
     * @param {jQuery} $handle
     * @param {Object} oStyle
     */
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
   *
   * @class
   */
  var Dialog = function () {

    /**
     * toggle button status
     *
     * @param {jQuery} $btn
     * @param {Boolean} bEnable
     */
    var toggleBtn = function ($btn, bEnable) {
      $btn.toggleClass('disabled', !bEnable);
      $btn.attr('disabled', !bEnable);
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $editable
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function ($editable, $dialog) {
      return $.Deferred(function (deferred) {
        var $imageDialog = $dialog.find('.note-image-dialog');

        var $imageInput = $dialog.find('.note-image-input'),
            $imageUrl = $dialog.find('.note-image-url'),
            $imageBtn = $dialog.find('.note-image-btn');

        $imageDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              $imageDialog.modal('hide');
              deferred.resolve(this.files);
            })
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            $imageDialog.modal('hide');
            deferred.resolve($imageUrl.val());
          });

          $imageUrl.keyup(function () {
            toggleBtn($imageBtn, $imageUrl.val());
          }).val('').focus();
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $imageInput.off('change');
          $imageUrl.off('keyup');
          $imageBtn.off('click');
        }).modal('show');
      });
    };

    /**
     * Show video dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog 
     * @param {Object} videoInfo 
     * @return {Promise}
     */
    this.showVideoDialog = function ($editable, $dialog, videoInfo) {
      return $.Deferred(function (deferred) {
        var $videoDialog = $dialog.find('.note-video-dialog');
        var $videoUrl = $videoDialog.find('.note-video-url'),
            $videoBtn = $videoDialog.find('.note-video-btn');

        $videoDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          $videoUrl.val(videoInfo.text).keyup(function () {
            toggleBtn($videoBtn, $videoUrl.val());
          }).trigger('keyup').trigger('focus');

          $videoBtn.click(function (event) {
            event.preventDefault();

            $videoDialog.modal('hide');
            deferred.resolve($videoUrl.val());
          });
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $videoUrl.off('keyup');
          $videoBtn.off('click');
        }).modal('show');
      });
    };

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog
     * @param {Object} linkInfo
     * @return {Promise}
     */
    this.showLinkDialog = function ($editable, $dialog, linkInfo) {
      return $.Deferred(function (deferred) {
        var $linkDialog = $dialog.find('.note-link-dialog');

        var $linkText = $linkDialog.find('.note-link-text'),
        $linkUrl = $linkDialog.find('.note-link-url'),
        $linkBtn = $linkDialog.find('.note-link-btn'),
        $openInNewWindow = $linkDialog.find('input[type=checkbox]');

        $linkDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          $linkText.val(linkInfo.text);

          $linkUrl.keyup(function () {
            toggleBtn($linkBtn, $linkUrl.val());
            // display same link on `Text to display` input
            // when create a new link
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
          }).val(linkInfo.url).trigger('focus');

          $openInNewWindow.prop('checked', linkInfo.newWindow);

          $linkBtn.one('click', function (event) {
            event.preventDefault();

            $linkDialog.modal('hide');
            deferred.resolve($linkUrl.val(), $openInNewWindow.is(':checked'));
          });
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $linkUrl.off('keyup');
        }).modal('show');
      }).promise();
    };

    /**
     * show help dialog
     *
     * @param {jQuery} $dialog
     */
    this.showHelpDialog = function ($editable, $dialog) {
      var $helpDialog = $dialog.find('.note-help-dialog');

      $helpDialog.one('hidden.bs.modal', function (event) {
        event.stopPropagation();
        $editable.focus();
      }).modal('show');
    };
  };

  /**
   * EventHandler
   */
  var EventHandler = function () {
    var editor = new Editor();
    var toolbar = new Toolbar(), popover = new Popover();
    var handle = new Handle(), dialog = new Dialog();

    /**
     * returns makeLayoutInfo from editor's descendant node.
     *
     * @param {Element} descendant
     * @returns {Object}
     */
    var makeLayoutInfo = function (descendant) {
      var $editor = $(descendant).closest('.note-editor');
      return $editor.length > 0 && dom.buildLayoutInfo($editor);
    };

    /**
     * insert Images from file array.
     *
     * @param {jQuery} $editable
     * @param {File[]} files
     */
    var insertImages = function ($editable, files) {
      editor.restoreRange($editable);
      var callbacks = $editable.data('callbacks');

      // If onImageUpload options setted
      if (callbacks.onImageUpload) {
        callbacks.onImageUpload(files, editor, $editable);
      // else insert Image as dataURL
      } else {
        $.each(files, function (idx, file) {
          async.readFileAsDataURL(file).then(function (sDataURL) {
            editor.insertImage($editable, sDataURL);
          }).fail(function () {
            if (callbacks.onImageUploadError) {
              callbacks.onImageUploadError();
            }
          });
        });
      }
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

    /**
     * `mousedown` event handler on $handle
     *  - controlSizing: resize image
     *
     * @param {MouseEvent} event
     */
    var hHandleMousedown = function (event) {
      if (dom.isControlSizing(event.target)) {
        var oLayoutInfo = makeLayoutInfo(event.target),
            $handle = oLayoutInfo.handle(), $popover = oLayoutInfo.popover(),
            $editable = oLayoutInfo.editable(), $editor = oLayoutInfo.editor();

        var elTarget = $handle.find('.note-control-selection').data('target'),
            $target = $(elTarget);
        var posStart = $target.offset(),
            scrollTop = $(document).scrollTop();

        $editor.on('mousemove', function (event) {
          
          editor.resizeTo({
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);

          handle.update($handle, {image: elTarget});
          popover.update($popover, {image: elTarget});
        }).one('mouseup', function () {
          $editor.off('mousemove');
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

        var server;
        var cmEditor;

        var options = $editor.data('options');

        // before command: detect control selection element($target)
        var $target;
        if ($.inArray(sEvent, ['resize', 'floatMe', 'removeMedia']) !== -1) {
          var $handle = oLayoutInfo.handle();
          var $selection = $handle.find('.note-control-selection');
          $target = $($selection.data('target'));
        }

        if (editor[sEvent]) { // on command
          $editable.trigger('focus');
          editor[sEvent]($editable, sValue, $target);
        }

        // after command
        if ($.inArray(sEvent, ['backColor', 'foreColor']) !== -1) {
          toolbar.updateRecentColor($btn[0], sEvent, sValue);
        } else if (sEvent === 'showLinkDialog') { // popover to dialog
          $editable.focus();
          var linkInfo = editor.getLinkInfo();

          editor.saveRange($editable);
          dialog.showLinkDialog($editable, $dialog, linkInfo).then(function (sLinkUrl, bNewWindow) {
            editor.restoreRange($editable);
            editor.createLink($editable, sLinkUrl, bNewWindow);
          });
        } else if (sEvent === 'showImageDialog') {
          $editable.focus();

          dialog.showImageDialog($editable, $dialog).then(function (data) {
            if (typeof data === 'string') {
              editor.restoreRange($editable);
              editor.insertImage($editable, data);
            } else {
              insertImages($editable, data);
            }
          });
        } else if (sEvent === 'showVideoDialog') {
          $editable.focus();
          var videoInfo = editor.getVideoInfo();

          editor.saveRange($editable);
          dialog.showVideoDialog($editable, $dialog, videoInfo).then(function (sUrl) {
            editor.restoreRange($editable);
            editor.insertVideo($editable, sUrl);
          });
        } else if (sEvent === 'showHelpDialog') {
          dialog.showHelpDialog($editable, $dialog);
        } else if (sEvent === 'fullscreen') {
          var $scrollbar = $('html, body');

          var resize = function (size) {
            $editor.css('width', size.w);
            $editable.css('height', size.h);
            $codable.css('height', size.h);
            if ($codable.data('cmEditor')) {
              $codable.data('cmEditor').setSize(null, size.h);
            }
          };

          $editor.toggleClass('fullscreen');
          var isFullscreen = $editor.hasClass('fullscreen');
          if (isFullscreen) {
            $editable.data('orgHeight', $editable.css('height'));

            $(window).on('resize', function () {
              resize({
                w: $(window).width(),
                h: $(window).height() - $toolbar.outerHeight()
              });
            }).trigger('resize');

            $scrollbar.css('overflow', 'hidden');
          } else {
            $(window).off('resize');
            resize({
              w: options.width || '',
              h: $editable.data('orgHeight')
            });
            $scrollbar.css('overflow', 'auto');
          }
          toolbar.updateFullscreen($toolbar, isFullscreen);
        } else if (sEvent === 'codeview') {
          $editor.toggleClass('codeview');

          var bCodeview = $editor.hasClass('codeview');
          if (bCodeview) {
            $codable.val($editable.html());
            $codable.height($editable.height());
            toolbar.deactivate($toolbar);
            $codable.focus();

            // activate CodeMirror as codable
            if (agent.bCodeMirror) {
              cmEditor = CodeMirror.fromTextArea($codable[0], $.extend({
                mode: 'text/html',
                lineNumbers: true
              }, options.codemirror));
              var tern = $editor.data('options').codemirror.tern || false;
              if (tern) {
                server = new CodeMirror.TernServer(tern);
                cmEditor.ternServer = server;
                cmEditor.on('cursorActivity', function (cm) {
                  server.updateArgHints(cm);
                });
              }

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
              cmEditor = $codable.data('cmEditor');
              $codable.val(cmEditor.getValue());
              cmEditor.toTextArea();
            }

            $editable.html($codable.val() || dom.emptyPara);
            $editable.height(options.height ? $codable.height() : 'auto');

            toolbar.activate($toolbar);
            $editable.focus();
          }

          toolbar.updateCodeview(oLayoutInfo.toolbar(), bCodeview);
        }

        hToolbarAndPopoverUpdate(event);
      }
    };

    var EDITABLE_PADDING = 24;
    /**
     * `mousedown` event handler on statusbar
     *
     * @param {MouseEvent} event
     */
    var hStatusbarMousedown = function (event) {
      var $document = $(document);
      var $editable = makeLayoutInfo(event.target).editable();
      var nEditableTop = $editable.offset().top - $document.scrollTop();

      $document.on('mousemove', function (event) {
        var nHeight = event.clientY - (nEditableTop + EDITABLE_PADDING);
        $editable.height(nHeight);
      }).one('mouseup', function () {
        $document.off('mousemove');
      });

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
      // HTML5 with jQuery - e.offsetX is undefined in Firefox
      if (event.offsetX === undefined) {
        var posCatcher = $(event.target).offset();
        posOffset = {
          x: event.pageX - posCatcher.left,
          y: event.pageY - posCatcher.top
        };
      } else {
        posOffset = {
          x: event.offsetX,
          y: event.offsetY
        };
      }

      var dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };

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
     * attach Drag and Drop Events
     *
     * @param {Object} oLayoutInfo - layout Informations
     */
    var attachDragAndDropEvent = function (oLayoutInfo) {
      var collection = $(), $dropzone = oLayoutInfo.dropzone,
          $dropzoneMessage = oLayoutInfo.dropzone.find('.note-dropzone-message');

      // show dropzone on dragenter when dragging a object to document.
      $(document).on('dragenter', function (e) {
        var bCodeview = oLayoutInfo.editor.hasClass('codeview');
        if (!bCodeview && collection.length === 0) {
          oLayoutInfo.editor.addClass('dragover');
          $dropzone.width(oLayoutInfo.editor.width());
          $dropzone.height(oLayoutInfo.editor.height());
          $dropzoneMessage.text('Drag Image Here');
        }
        collection = collection.add(e.target);
      }).on('dragleave', function (e) {
        collection = collection.not(e.target);
        if (collection.length === 0) {
          oLayoutInfo.editor.removeClass('dragover');
        }
      }).on('drop', function () {
        collection = $();
        oLayoutInfo.editor.removeClass('dragover');
      });

      // change dropzone's message on hover.
      $dropzone.on('dragenter', function () {
        $dropzone.addClass('hover');
        $dropzoneMessage.text('Drop Image');
      }).on('dragleave', function () {
        $dropzone.removeClass('hover');
        $dropzoneMessage.text('Drag Image Here');
      });

      // attach dropImage
      $dropzone.on('drop', function (event) {
        var dataTransfer = event.originalEvent.dataTransfer;
        if (dataTransfer && dataTransfer.files) {
          var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
          oLayoutInfo.editable().focus();
          insertImages(oLayoutInfo.editable(), dataTransfer.files);
        }
        event.preventDefault();
      }).on('dragover', false); // prevent default dragover event
    };


    /**
     * bind KeyMap on keydown
     *
     * @param {Object} oLayoutInfo
     * @param {Object} keyMap
     */
    this.bindKeyMap = function (oLayoutInfo, keyMap) {
      var $editor = oLayoutInfo.editor;
      var $editable = oLayoutInfo.editable;

      $editable.on('keydown', function (event) {
        var aKey = [];

        // modifier
        if (event.metaKey) { aKey.push('CMD'); }
        if (event.ctrlKey) { aKey.push('CTRL'); }
        if (event.shiftKey) { aKey.push('SHIFT'); }

        // keycode
        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) { aKey.push(keyName); }

        var handler = keyMap[aKey.join('+')];
        if (handler) {
          event.preventDefault();

          editor[handler]($editable, $editor.data('options'));
        } else if (key.isEdit(event.keyCode)) {
          editor.recordUndo($editable);
        }
      });
    };

    /**
     * attach eventhandler
     *
     * @param {Object} oLayoutInfo - layout Informations
     * @param {Object} options - user options include custom event handlers
     * @param {Function} options.enter - enter key handler
     */
    this.attach = function (oLayoutInfo, options) {
      var keyMap = options.keyMap[agent.bMac ? 'mac' : 'pc'];
      this.bindKeyMap(oLayoutInfo, keyMap);

      oLayoutInfo.editable.on('mousedown', hMousedown);
      oLayoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      oLayoutInfo.editable.on('scroll', hScroll);

      // Doesn't attach `dragAndDrop` event when `options.disableDragAndDrop` is true
      if (!options.disableDragAndDrop) {
        attachDragAndDropEvent(oLayoutInfo);
      }

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

      // save options on editor
      oLayoutInfo.editor.data('options', options);

      // ret styleWithCSS for backColor / foreColor clearing with 'inherit'.
      if (options.styleWithSpan && !agent.bMSIE) {
        // protect FF Error: NS_ERROR_FAILURE: Failure
        setTimeout(function () {
          document.execCommand('styleWithCSS', 0, true);
        });
      }

      // History
      oLayoutInfo.editable.data('NoteHistory', new History());

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
      if (options.onpaste) { oLayoutInfo.editable.on('paste', options.onpaste); }
      if (options.onToolbarClick) { oLayoutInfo.toolbar.click(options.onToolbarClick); }

      // callbacks for advanced features (camel)
      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      oLayoutInfo.editable.data('callbacks', {
        onChange: options.onChange,
        onAutoSave: options.onAutoSave,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUploadError,
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
   * renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function () {
    var tplToolbarInfo, tplPopover, tplHandle, tplDialog, tplStatusbar;

    /* jshint ignore:start */
    tplToolbarInfo = {
      picture: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.image + '" data-event="showImageDialog" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';
      },
      link: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.link.link + '" data-event="showLinkDialog" tabindex="-1"><i class="fa fa-link icon-link"></i></button>';
      },
      video: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.video.video + '" data-event="showVideoDialog" tabindex="-1"><i class="fa fa-youtube-play icon-play"></i></button>';
      },
      table: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + lang.table.table + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-table icon-table"></i> <span class="caret"></span></button>' +
                 '<ul class="dropdown-menu">' +
                   '<div class="note-dimension-picker">' +
                     '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' +
                     '<div class="note-dimension-picker-highlighted"></div>' +
                     '<div class="note-dimension-picker-unhighlighted"></div>' +
                   '</div>' +
                   '<div class="note-dimension-display"> 1 x 1 </div>' +
                 '</ul>';
      },
      style: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + lang.style.style + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-magic icon-magic"></i> <span class="caret"></span></button>' +
               '<ul class="dropdown-menu">' +
                 '<li><a data-event="formatBlock" data-value="p">' + lang.style.normal + '</a></li>' +
                 '<li><a data-event="formatBlock" data-value="blockquote"><blockquote>' + lang.style.blockquote + '</blockquote></a></li>' +
                 '<li><a data-event="formatBlock" data-value="pre">' + lang.style.pre + '</a></li>' +
                 '<li><a data-event="formatBlock" data-value="h1"><h1>' + lang.style.h1 + '</h1></a></li>' +
                 '<li><a data-event="formatBlock" data-value="h2"><h2>' + lang.style.h2 + '</h2></a></li>' +
                 '<li><a data-event="formatBlock" data-value="h3"><h3>' + lang.style.h3 + '</h3></a></li>' +
                 '<li><a data-event="formatBlock" data-value="h4"><h4>' + lang.style.h4 + '</h4></a></li>' +
                 '<li><a data-event="formatBlock" data-value="h5"><h5>' + lang.style.h5 + '</h5></a></li>' +
                 '<li><a data-event="formatBlock" data-value="h6"><h6>' + lang.style.h6 + '</h6></a></li>' +
               '</ul>';
      },
      fontname: function(lang) {
        var aFont = [
          'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
          'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande',
          'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'
        ];

        var sMarkup = '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + lang.font.name + '" tabindex="-1"><span class="note-current-fontname">Arial</span> <b class="caret"></b></button>';
        sMarkup += '<ul class="dropdown-menu">';
        for (var idx = 0; idx < aFont.length; idx++ ) {
          sMarkup += '<li><a data-event="fontName" data-value="' + aFont[idx] + '"><i class="fa fa-check icon-ok"></i> ' + aFont[idx] + '</a></li>';
        }
        sMarkup += '</ul>';

        return sMarkup;
      },
      fontsize: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + lang.font.size + '" tabindex="-1"><span class="note-current-fontsize">11</span> <b class="caret"></b></button>' +
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
      color: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small note-recent-color" title="' + lang.color.recent + '" data-event="color" data-value=\'{"backColor":"yellow"}\' tabindex="-1"><i class="fa fa-font icon-font" style="color:black;background-color:yellow;"></i></button>' +
               '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + lang.color.more + '" data-toggle="dropdown" tabindex="-1">' +
                 '<span class="caret"></span>' +
               '</button>' +
               '<ul class="dropdown-menu">' +
                 '<li>' +
                   '<div class="btn-group">' +
                     '<div class="note-palette-title">' + lang.color.background + '</div>' +
                     '<div class="note-color-reset" data-event="backColor" data-value="inherit" title="' + lang.color.transparent + '">' + lang.color.setTransparent + '</div>' +
                     '<div class="note-color-palette" data-target-event="backColor"></div>' +
                   '</div>' +
                   '<div class="btn-group">' +
                     '<div class="note-palette-title">' + lang.color.foreground + '</div>' +
                     '<div class="note-color-reset" data-event="foreColor" data-value="inherit" title="' + lang.color.reset + '">' + lang.color.resetToDefault + '</div>' +
                     '<div class="note-color-palette" data-target-event="foreColor"></div>' +
                   '</div>' +
                 '</li>' +
               '</ul>';
      },
      bold: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.font.bold + '" data-shortcut="Ctrl+B" data-mac-shortcut="⌘+B" data-event="bold" tabindex="-1"><i class="fa fa-bold icon-bold"></i></button>';
      },
      italic: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.font.italic + '" data-shortcut="Ctrl+I" data-mac-shortcut="⌘+I" data-event="italic" tabindex="-1"><i class="fa fa-italic icon-italic"></i></button>';
      },
      underline: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.font.underline + '" data-shortcut="Ctrl+U" data-mac-shortcut="⌘+U" data-event="underline" tabindex="-1"><i class="fa fa-underline icon-underline"></i></button>';
      },
      clear: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.font.clear + '" data-shortcut="Ctrl+\\" data-mac-shortcut="⌘+\\" data-event="removeFormat" tabindex="-1"><i class="fa fa-eraser icon-eraser"></i></button>';
      },
      ul: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.lists.unordered + '" data-shortcut="Ctrl+Shift+8" data-mac-shortcut="⌘+⇧+7" data-event="insertUnorderedList" tabindex="-1"><i class="fa fa-list-ul icon-list-ul"></i></button>';
      },
      ol: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.lists.ordered + '" data-shortcut="Ctrl+Shift+7" data-mac-shortcut="⌘+⇧+8" data-event="insertOrderedList" tabindex="-1"><i class="fa fa-list-ol icon-list-ol"></i></button>';
      },
      paragraph: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + lang.paragraph.paragraph + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i>  <span class="caret"></span></button>' +
        '<div class="dropdown-menu">' +
          '<div class="note-align btn-group">' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.left + '" data-shortcut="Ctrl+Shift+L" data-mac-shortcut="⌘+⇧+L" data-event="justifyLeft" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.center + '" data-shortcut="Ctrl+Shift+E" data-mac-shortcut="⌘+⇧+E" data-event="justifyCenter" tabindex="-1"><i class="fa fa-align-center icon-align-center"></i></button>' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.right + '" data-shortcut="Ctrl+Shift+R" data-mac-shortcut="⌘+⇧+R" data-event="justifyRight" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.justify + '" data-shortcut="Ctrl+Shift+J" data-mac-shortcut="⌘+⇧+J" data-event="justifyFull" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
          '</div>' +
          '<div class="note-list btn-group">' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.outdent + '" data-shortcut="Ctrl+[" data-mac-shortcut="⌘+[" data-event="outdent" tabindex="-1"><i class="fa fa-outdent icon-indent-left"></i></button>' +
            '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.indent + '" data-shortcut="Ctrl+]" data-mac-shortcut="⌘+]" data-event="indent" tabindex="-1"><i class="fa fa-indent icon-indent-right"></i></button>' +
          '</div>' +
        '</div>';
      },
      height: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + lang.font.height + '" tabindex="-1"><i class="fa fa-text-height icon-text-height"></i>&nbsp; <b class="caret"></b></button>' +
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
      help: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.options.help + '" data-event="showHelpDialog" tabindex="-1"><i class="fa fa-question icon-question"></i></button>';
      },
      fullscreen: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.options.fullscreen + '" data-event="fullscreen" tabindex="-1"><i class="fa fa-arrows-alt icon-fullscreen"></i></button>';
      },
      codeview: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.options.codeview + '" data-event="codeview" tabindex="-1"><i class="fa fa-code icon-code"></i></button>';
      },
      undo: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.history.undo + '" data-event="undo" tabindex="-1"><i class="fa fa-undo icon-undo"></i></button>';
      },
      redo: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.history.redo + '" data-event="redo" tabindex="-1"><i class="fa fa-repeat icon-repeat"></i></button>';
      }
    };
    tplPopover = function (lang) {
      return '<div class="note-popover">' +
                '<div class="note-link-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-link-content">' +
                    '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                    '<div class="note-insert btn-group">' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.link.edit + '" data-event="showLinkDialog" tabindex="-1"><i class="fa fa-edit icon-edit"></i></button>' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.link.unlink + '" data-event="unlink" tabindex="-1"><i class="fa fa-unlink icon-unlink"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="note-image-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-image-content">' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.resizeFull + '" data-event="resize" data-value="1" tabindex="-1"><span class="note-fontsize-10">100%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.resizeHalf + '" data-event="resize" data-value="0.5" tabindex="-1"><span class="note-fontsize-10">50%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.resizeQuarter + '" data-event="resize" data-value="0.25" tabindex="-1"><span class="note-fontsize-10">25%</span> </button>' +
                    '</div>' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.floatLeft + '" data-event="floatMe" data-value="left" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.floatRight + '" data-event="floatMe" data-value="right" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.floatNone + '" data-event="floatMe" data-value="none" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
                    '</div>' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.image.remove + '" data-event="removeMedia" data-value="none" tabindex="-1"><i class="fa fa-trash-o icon-trash"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
    };

    var tplHandle = function () {
      return '<div class="note-handle">' +
               '<div class="note-control-selection">' +
                 '<div class="note-control-selection-bg"></div>' +
                 '<div class="note-control-holder note-control-nw"></div>' +
                 '<div class="note-control-holder note-control-ne"></div>' +
                 '<div class="note-control-holder note-control-sw"></div>' +
                 '<div class="note-control-sizing note-control-se"></div>' +
                 '<div class="note-control-selection-info"></div>' +
               '</div>' +
             '</div>';
    };

    var tplShortcutText = function (lang, options) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + lang.shortcut.textFormatting + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + B</td><td>' + lang.font.bold + '</td></tr>' +
                 '<tr><td>⌘ + I</td><td>' + lang.font.italic + '</td></tr>' +
                 '<tr><td>⌘ + U</td><td>' + lang.font.underline + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + S</td><td>' + lang.font.strike + '</td></tr>' +
                 '<tr><td>⌘ + \\</td><td>' + lang.font.clear + '</td></tr>' +
                 '</tr>' +
               '</tbody>' +
             '</table>';
    };

    var tplShortcutAction = function (lang, options) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + lang.shortcut.action + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + Z</td><td>' + lang.history.undo + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + Z</td><td>' + lang.history.redo + '</td></tr>' +
                 '<tr><td>⌘ + ]</td><td>' + lang.paragraph.indent + '</td></tr>' +
                 '<tr><td>⌘ + [</td><td>' + lang.paragraph.outdent + '</td></tr>' +
                 '<tr><td>⌘ + ENTER</td><td>' + lang.hr.insert + '</td></tr>' +
               '</tbody>' +
             '</table>';
    };

    var tplExtraShortcuts = function(lang, options) {
      var template =
             '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + lang.shortcut.extraKeys + '</th></tr>' +
               '</thead>' +
               '<tbody>';
      for (var key in options.extraKeys) {
          if (!options.extraKeys.hasOwnProperty(key)) {
              continue;
          }
          template += '<tr><td>' + key + '</td><td>' + options.extraKeys[key] + '</td></tr>';
      }
      template +='</tbody></table>';
      return template;
    };

    var tplShortcutPara = function (lang, options) {
      return '<table class="note-shortcut">' +
                '<thead>' +
                  '<tr><th></th><th>' + lang.shortcut.paragraphFormatting + '</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>⌘ + ⇧ + L</td><td>' + lang.paragraph.left + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + E</td><td>' + lang.paragraph.center + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + R</td><td>' + lang.paragraph.right + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + J</td><td>' + lang.paragraph.justify + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM7</td><td>' + lang.lists.ordered + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM8</td><td>' + lang.lists.unordered + '</td></tr>' +
                '</tbody>' +
              '</table>';
    };

    var tplShortcutStyle = function (lang, options) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + lang.shortcut.documentStyle + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + NUM0</td><td>' + lang.style.normal + '</td></tr>' +
                 '<tr><td>⌘ + NUM1</td><td>' + lang.style.h1 + '</td></tr>' +
                 '<tr><td>⌘ + NUM2</td><td>' + lang.style.h2 + '</td></tr>' +
                 '<tr><td>⌘ + NUM3</td><td>' + lang.style.h3 + '</td></tr>' +
                 '<tr><td>⌘ + NUM4</td><td>' + lang.style.h4 + '</td></tr>' +
                 '<tr><td>⌘ + NUM5</td><td>' + lang.style.h5 + '</td></tr>' +
                 '<tr><td>⌘ + NUM6</td><td>' + lang.style.h6 + '</td></tr>' +
               '</tbody>' +
             '</table>';
    };

    var tplShortcutTable = function (lang, options) {
      var template = '<table class="note-shortcut-layout">' +
               '<tbody>' +
                 '<tr><td>' + tplShortcutAction(lang, options) + '</td><td>' + tplShortcutText(lang, options) + '</td></tr>' +
                 '<tr><td>' + tplShortcutStyle(lang, options) + '</td><td>' + tplShortcutPara(lang, options) + '</td></tr>';
      if (options.extraKeys) {
          template += '<tr><td colspan="2">' + tplExtraShortcuts(lang, options) + '</td></tr>';
      }
      template += '</tbody</table>';
      return template;
    };

    var replaceMacKeys = function (sHtml) {
      return sHtml.replace(/⌘/g, 'Ctrl').replace(/⇧/g, 'Shift');
    };

    tplDialog = function (lang, options) {
      var tplImageDialog = function () {
        return '<div class="note-image-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-header">' +
                       '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' +
                       '<h4>' + lang.image.insert + '</h4>' +
                     '</div>' +
                     '<div class="modal-body">' +
                       '<div class="row-fluid">' +
                         '<h5>' + lang.image.selectFromFiles + '</h5>' +
                         '<input class="note-image-input" type="file" name="files" accept="image/*" />' +
                         '<h5>' + lang.image.url + '</h5>' +
                         '<input class="note-image-url form-control span12" type="text" />' +
                       '</div>' +
                     '</div>' +
                     '<div class="modal-footer">' +
                       '<button href="#" class="btn btn-primary note-image-btn disabled" disabled="disabled">' + lang.image.insert + '</button>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>';
      };

      var tplLinkDialog = function () {
        return '<div class="note-link-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-header">' +
                       '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' +
                       '<h4>' + lang.link.insert + '</h4>' +
                     '</div>' +
                     '<div class="modal-body">' +
                       '<div class="row-fluid">' +
                         '<div class="form-group">' +
                           '<label>' + lang.link.textToDisplay + '</label>' +
                           '<input class="note-link-text form-control span12" disabled type="text" />' +
                         '</div>' +
                         '<div class="form-group">' +
                           '<label>' + lang.link.url + '</label>' +
                           '<input class="note-link-url form-control span12" type="text" />' +
                         '</div>' +
                         (!options.disableLinkTarget ?
                           '<div class="checkbox">' +
                             '<label>' + '<input type="checkbox" checked> ' +
                               lang.link.openInNewWindow +
                             '</label>' +
                           '</div>' : ''
                         ) +
                       '</div>' +
                     '</div>' +
                     '<div class="modal-footer">' +
                       '<button href="#" class="btn btn-primary note-link-btn disabled" disabled="disabled">' + lang.link.insert + '</button>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>';
      };

      var tplVideoDialog = function () {
        return '<div class="note-video-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-header">' +
                       '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' +
                       '<h4>' + lang.video.insert + '</h4>' +
                     '</div>' +
                     '<div class="modal-body">' +
                       '<div class="row-fluid">' +

                       '<div class="form-group">' +
                         '<label>' + lang.video.url + '</label>&nbsp;<small class="text-muted">' + lang.video.providers + '</small>' +
                         '<input class="note-video-url form-control span12" type="text" />' +
                       '</div>' +
                       '</div>' +
                     '</div>' +
                     '<div class="modal-footer">' +
                       '<button href="#" class="btn btn-primary note-video-btn disabled" disabled="disabled">' + lang.video.insert + '</button>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>';
      };

      var tplHelpDialog = function () {
        return '<div class="note-help-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-body">' +
                       '<a class="modal-close pull-right" aria-hidden="true" tabindex="-1">' + lang.shortcut.close + '</a>' +
                       '<div class="title">' + lang.shortcut.shortcuts + '</div>' +
                       (agent.bMac ? tplShortcutTable(lang, options) : replaceMacKeys(tplShortcutTable(lang, options))) +
                       '<p class="text-center"><a href="//hackerwins.github.io/summernote/" target="_blank">Summernote 0.5.1</a> · <a href="//github.com/HackerWins/summernote" target="_blank">Project</a> · <a href="//github.com/HackerWins/summernote/issues" target="_blank">Issues</a></p>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>';
      };

      return '<div class="note-dialog">' +
               tplImageDialog() +
               tplLinkDialog() +
               tplVideoDialog() +
               tplHelpDialog() +
             '</div>';
    };

    tplStatusbar = function () {
      return '<div class="note-resizebar"><div class="note-icon-bar"></div><div class="note-icon-bar"></div><div class="note-icon-bar"></div></div>';
    };
    /* jshint ignore:end */

    // createTooltip
    var createTooltip = function ($container, sPlacement) {
      $container.find('button').each(function (i, elBtn) {
        var $btn = $(elBtn);
        var tplShortcut = $btn.attr(agent.bMac ? 'data-mac-shortcut': 'data-shortcut');
        if (tplShortcut) { $btn.attr('title', function (i, v) { return v + ' (' + tplShortcut + ')'; }); }
      // bootstrap tooltip on btn-group bug: https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({container: 'body', trigger: 'hover', placement: sPlacement || 'top'})
        .on('click', function () {$(this).tooltip('hide'); });
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
        var aPaletteContents = [];
        for (var row = 0, szRow = aaColor.length; row < szRow; row++) {
          var aColor = aaColor[row];
          var aButton = [];
          for (var col = 0, szCol = aColor.length; col < szCol; col++) {
            var sColor = aColor[col];
            aButton.push(['<button type="button" class="note-color-btn" style="background-color:', sColor,
                           ';" data-event="', sEvent,
                           '" data-value="', sColor,
                           '" title="', sColor,
                           '" data-toggle="button" tabindex="-1"></button>'].join(''));
          }
          aPaletteContents.push('<div>' + aButton.join('') + '</div>');
        }
        $palette.html(aPaletteContents.join(''));
      });
    };

    /**
     * create summernote layout
     *
     * @param {jQuery} $holder
     * @param {Object} options
     */
    this.createLayout = function ($holder, options) {
      //already created
      var next = $holder.next();
      if (next && next.hasClass('note-editor')) { return; }

      //01. create Editor
      var $editor = $('<div class="note-editor"></div>');
      if (options.width) {
        $editor.width(options.width);
      }

      //02. statusbar (resizebar)
      if (options.height > 0) {
        $('<div class="note-statusbar">' + tplStatusbar() + '</div>').prependTo($editor);
      }

      //03. create Editable
      var isContentEditable = !$holder.is(':disabled');
      var $editable = $('<div class="note-editable" contentEditable="' + isContentEditable + '"></div>')
          .prependTo($editor);
      if (options.height) {
        $editable.height(options.height);
      }
      if (options.direction) {
        $editable.attr('dir', options.direction);
      }

      $editable.html(dom.html($holder) || dom.emptyPara);

      //031. create codable
      $('<textarea class="note-codable"></textarea>').prependTo($editor);

      var langInfo = $.summernote.lang[options.lang];

      //04. create Toolbar
      var sToolbar = '';
      for (var idx = 0, sz = options.toolbar.length; idx < sz; idx ++) {
        var group = options.toolbar[idx];
        sToolbar += '<div class="note-' + group[0] + ' btn-group">';
        for (var i = 0, szGroup = group[1].length; i < szGroup; i++) {
          sToolbar += tplToolbarInfo[group[1][i]](langInfo);
        }
        sToolbar += '</div>';
      }

      sToolbar = '<div class="note-toolbar btn-toolbar">' + sToolbar + '</div>';

      var $toolbar = $(sToolbar).prependTo($editor);
      createPalette($toolbar);
      createTooltip($toolbar, 'bottom');

      //05. create Popover
      var $popover = $(tplPopover(langInfo)).prependTo($editor);
      createTooltip($popover);

      //06. handle(control selection, ...)
      $(tplHandle()).prependTo($editor);

      //07. create Dialog
      var $dialog = $(tplDialog(langInfo, options)).prependTo($editor);
      $dialog.find('button.close, a.modal-close').click(function () {
        $(this).closest('.modal').modal('hide');
      });

      //08. create Dropzone
      $('<div class="note-dropzone"><div class="note-dropzone-message"></div></div>').prependTo($editor);

      //09. Editor/Holder switch
      $editor.insertAfter($holder);
      $holder.hide();
    };

    /**
     * returns layoutInfo from holder
     *
     * @param {jQuery} $holder - placeholder
     * @returns {Object}
     */
    this.layoutInfoFromHolder = function ($holder) {
      var $editor = $holder.next();
      if (!$editor.hasClass('note-editor')) { return; }

      var layoutInfo = dom.buildLayoutInfo($editor);
      // cache all properties.
      for (var key in layoutInfo) {
        if (layoutInfo.hasOwnProperty(key)) {
          layoutInfo[key] = layoutInfo[key].call();
        }
      }
      return layoutInfo;
    };

    /**
     * removeLayout
     *
     * @param {jQuery} $holder - placeholder
     */
    this.removeLayout = function ($holder) {
      var info = this.layoutInfoFromHolder($holder);
      if (!info) { return; }
      $holder.html(info.editable.html());

      info.editor.remove();
      $holder.show();
    };
  };

  // jQuery namespace for summernote
  $.summernote = $.summernote || {};

  // extends default `settings`
  $.extend($.summernote, settings);

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * extend jquery fn
   */
  $.fn.extend({
    /**
     * initialize summernote
     *  - create editor layout and attach Mouse and keyboard events.
     *
     * @param {Object} options
     * @returns {this}
     */
    summernote: function (options) {
      // extend default options
      options = $.extend({}, $.summernote.options, options);

      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        // createLayout with options
        renderer.createLayout($holder, options);

        var info = renderer.layoutInfoFromHolder($holder);
        eventHandler.attach(info, options);

        // Textarea: auto filling the code before form submit.
        if (dom.isTextarea($holder[0])) {
          $holder.closest('form').submit(function () {
            $holder.html($holder.code());
          });
        }
      });

      // focus on first editable element
      if (this.first() && options.focus) {
        var info = renderer.layoutInfoFromHolder(this.first());
        info.editable.focus();
      }

      // callback on init
      if (this.length > 0 && options.oninit) {
        options.oninit();
      }

      return this;
    },
    // 

    /**
     * get the HTML contents of note or set the HTML contents of note.
     *
     * @param {String} [sHTML] - HTML contents(optional, set)
     * @returns {this|String} - context(set) or HTML contents of note(get).
     */
    code: function (sHTML) {
      // get the HTML contents of note
      if (sHTML === undefined) {
        var $holder = this.first();
        if ($holder.length === 0) { return; }
        var info = renderer.layoutInfoFromHolder($holder);
        if (!!(info && info.editable)) {
          var bCodeview = info.editor.hasClass('codeview');
          if (bCodeview && agent.bCodeMirror) {
            info.codable.data('cmEditor').save();
          }
          return bCodeview ? info.codable.val() : info.editable.html();
        }
        return $holder.html();
      }

      // set the HTML contents of note
      this.each(function (i, elHolder) {
        var info = renderer.layoutInfoFromHolder($(elHolder));
        if (info && info.editable) { info.editable.html(sHTML); }
      });

      return this;
    },

    /**
     * destroy Editor Layout and dettach Key and Mouse Event
     * @returns {this}
     */
    destroy: function () {
      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        var info = renderer.layoutInfoFromHolder($holder);
        if (!info || !info.editable) { return; }
        eventHandler.dettach(info);
        renderer.removeLayout($holder);
      });

      return this;
    }
  });
}));
