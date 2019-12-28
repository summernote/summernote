/*!
 * 
 * Super simple wysiwyg editor v0.8.14
 * https://summernote.org
 * 
 * 
 * Copyright 2013- Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license.
 * 
 * Date: 2019-12-28T14:35Z
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("jQuery")) : factory(root["jQuery"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


class Renderer {
  constructor(markup, children, options, callback) {
    this.markup = markup;
    this.children = children;
    this.options = options;
    this.callback = callback;
  }

  render($parent) {
    const $node = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this.markup);

    if (this.options && this.options.contents) {
      $node.html(this.options.contents);
    }

    if (this.options && this.options.className) {
      $node.addClass(this.options.className);
    }

    if (this.options && this.options.data) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default.a.each(this.options.data, (k, v) => {
        $node.attr('data-' + k, v);
      });
    }

    if (this.options && this.options.click) {
      $node.on('click', this.options.click);
    }

    if (this.children) {
      const $container = $node.find('.note-children-container');
      this.children.forEach(child => {
        child.render($container.length ? $container : $node);
      });
    }

    if (this.callback) {
      this.callback($node, this.options);
    }

    if (this.options && this.options.callback) {
      this.options.callback($node);
    }

    if ($parent) {
      $parent.append($node);
    }

    return $node;
  }

}

/* harmony default export */ __webpack_exports__["a"] = ({
  create: (markup, callback) => {
    return function () {
      const options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
      let children = Array.isArray(arguments[0]) ? arguments[0] : [];

      if (options && options.children) {
        children = options.children;
      }

      return new Renderer(markup, children, options, callback);
    };
  }
});

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_);

// CONCATENATED MODULE: ./src/js/base/summernote-en-US.js

external_jQuery_default.a.summernote = external_jQuery_default.a.summernote || {
  lang: {}
};
external_jQuery_default.a.extend(external_jQuery_default.a.summernote.lang, {
  'en-US': {
    font: {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      clear: 'Remove Font Style',
      height: 'Line Height',
      name: 'Font Family',
      strikethrough: 'Strikethrough',
      subscript: 'Subscript',
      superscript: 'Superscript',
      size: 'Font Size',
      sizeunit: 'Font Size Unit'
    },
    image: {
      image: 'Picture',
      insert: 'Insert Image',
      resizeFull: 'Resize full',
      resizeHalf: 'Resize half',
      resizeQuarter: 'Resize quarter',
      resizeNone: 'Original size',
      floatLeft: 'Float Left',
      floatRight: 'Float Right',
      floatNone: 'Remove float',
      shapeRounded: 'Shape: Rounded',
      shapeCircle: 'Shape: Circle',
      shapeThumbnail: 'Shape: Thumbnail',
      shapeNone: 'Shape: None',
      dragImageHere: 'Drag image or text here',
      dropImage: 'Drop image or Text',
      selectFromFiles: 'Select from files',
      maximumFileSize: 'Maximum file size',
      maximumFileSizeError: 'Maximum file size exceeded.',
      url: 'Image URL',
      remove: 'Remove Image',
      original: 'Original'
    },
    video: {
      video: 'Video',
      videoLink: 'Video Link',
      insert: 'Insert Video',
      url: 'Video URL',
      providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
    },
    link: {
      link: 'Link',
      insert: 'Insert Link',
      unlink: 'Unlink',
      edit: 'Edit',
      textToDisplay: 'Text to display',
      url: 'To what URL should this link go?',
      openInNewWindow: 'Open in new window',
      useProtocol: 'Use default protocol'
    },
    table: {
      table: 'Table',
      addRowAbove: 'Add row above',
      addRowBelow: 'Add row below',
      addColLeft: 'Add column left',
      addColRight: 'Add column right',
      delRow: 'Delete row',
      delCol: 'Delete column',
      delTable: 'Delete table'
    },
    hr: {
      insert: 'Insert Horizontal Rule'
    },
    style: {
      style: 'Style',
      p: 'Normal',
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
      background: 'Background Color',
      foreground: 'Text Color',
      transparent: 'Transparent',
      setTransparent: 'Set transparent',
      reset: 'Reset',
      resetToDefault: 'Reset to default',
      cpSelect: 'Select'
    },
    shortcut: {
      shortcuts: 'Keyboard shortcuts',
      close: 'Close',
      textFormatting: 'Text formatting',
      action: 'Action',
      paragraphFormatting: 'Paragraph formatting',
      documentStyle: 'Document Style',
      extraKeys: 'Extra keys'
    },
    help: {
      'insertParagraph': 'Insert Paragraph',
      'undo': 'Undoes the last command',
      'redo': 'Redoes the last command',
      'tab': 'Tab',
      'untab': 'Untab',
      'bold': 'Set a bold style',
      'italic': 'Set a italic style',
      'underline': 'Set a underline style',
      'strikethrough': 'Set a strikethrough style',
      'removeFormat': 'Clean a style',
      'justifyLeft': 'Set left align',
      'justifyCenter': 'Set center align',
      'justifyRight': 'Set right align',
      'justifyFull': 'Set full align',
      'insertUnorderedList': 'Toggle unordered list',
      'insertOrderedList': 'Toggle ordered list',
      'outdent': 'Outdent on current paragraph',
      'indent': 'Indent on current paragraph',
      'formatPara': 'Change current block\'s format as a paragraph(P tag)',
      'formatH1': 'Change current block\'s format as H1',
      'formatH2': 'Change current block\'s format as H2',
      'formatH3': 'Change current block\'s format as H3',
      'formatH4': 'Change current block\'s format as H4',
      'formatH5': 'Change current block\'s format as H5',
      'formatH6': 'Change current block\'s format as H6',
      'insertHorizontalRule': 'Insert horizontal rule',
      'linkDialog.show': 'Show Link Dialog'
    },
    history: {
      undo: 'Undo',
      redo: 'Redo'
    },
    specialChar: {
      specialChar: 'SPECIAL CHARACTERS',
      select: 'Select Special characters'
    },
    output: {
      noSelection: 'No Selection Made!'
    }
  }
});
// CONCATENATED MODULE: ./src/js/base/core/env.js

const isSupportAmd = typeof define === 'function' && __webpack_require__(2); // eslint-disable-line

/**
 * returns whether font is installed or not.
 *
 * @param {String} fontName
 * @return {Boolean}
 */

const genericFontFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];

function validFontName(fontName) {
  return external_jQuery_default.a.inArray(fontName.toLowerCase(), genericFontFamilies) === -1 ? `'${fontName}'` : fontName;
}

function isFontInstalled(fontName) {
  const testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
  const testText = 'mmmmmmmmmmwwwww';
  const testSize = '200px';
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = testSize + " '" + testFontName + "'";
  const originalWidth = context.measureText(testText).width;
  context.font = testSize + ' ' + validFontName(fontName) + ', "' + testFontName + '"';
  const width = context.measureText(testText).width;
  return originalWidth !== width;
}

const userAgent = navigator.userAgent;
const isMSIE = /MSIE|Trident/i.test(userAgent);
let browserVersion;

if (isMSIE) {
  let matches = /MSIE (\d+[.]\d+)/.exec(userAgent);

  if (matches) {
    browserVersion = parseFloat(matches[1]);
  }

  matches = /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.exec(userAgent);

  if (matches) {
    browserVersion = parseFloat(matches[1]);
  }
}

const isEdge = /Edge\/\d+/.test(userAgent);
let hasCodeMirror = !!window.CodeMirror;
const isSupportTouch = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0; // [workaround] IE doesn't have input events for contentEditable
// - see: https://goo.gl/4bfIvA

const inputEventName = isMSIE ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';
/**
 * @class core.env
 *
 * Object which check platform and agent
 *
 * @singleton
 * @alternateClassName env
 */

/* harmony default export */ var env = ({
  isMac: navigator.appVersion.indexOf('Mac') > -1,
  isMSIE,
  isEdge,
  isFF: !isEdge && /firefox/i.test(userAgent),
  isPhantom: /PhantomJS/i.test(userAgent),
  isWebkit: !isEdge && /webkit/i.test(userAgent),
  isChrome: !isEdge && /chrome/i.test(userAgent),
  isSafari: !isEdge && /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
  browserVersion,
  jqueryVersion: parseFloat(external_jQuery_default.a.fn.jquery),
  isSupportAmd,
  isSupportTouch,
  hasCodeMirror,
  isFontInstalled,
  isW3CRangeSupport: !!document.createRange,
  inputEventName,
  genericFontFamilies,
  validFontName
});
// CONCATENATED MODULE: ./src/js/base/core/func.js

/**
 * @class core.func
 *
 * func utils (for high-order func's arg)
 *
 * @singleton
 * @alternateClassName func
 */

function eq(itemA) {
  return function (itemB) {
    return itemA === itemB;
  };
}

function eq2(itemA, itemB) {
  return itemA === itemB;
}

function peq2(propName) {
  return function (itemA, itemB) {
    return itemA[propName] === itemB[propName];
  };
}

function ok() {
  return true;
}

function fail() {
  return false;
}

function not(f) {
  return function () {
    return !f.apply(f, arguments);
  };
}

function and(fA, fB) {
  return function (item) {
    return fA(item) && fB(item);
  };
}

function func_self(a) {
  return a;
}

function invoke(obj, method) {
  return function () {
    return obj[method].apply(obj, arguments);
  };
}

let idCounter = 0;
/**
 * reset globally-unique id
 *
 */

function resetUniqueId() {
  idCounter = 0;
}
/**
 * generate a globally-unique id
 *
 * @param {String} [prefix]
 */


function uniqueId(prefix) {
  const id = ++idCounter + '';
  return prefix ? prefix + id : id;
}
/**
 * returns bnd (bounds) from rect
 *
 * - IE Compatibility Issue: http://goo.gl/sRLOAo
 * - Scroll Issue: http://goo.gl/sNjUc
 *
 * @param {Rect} rect
 * @return {Object} bounds
 * @return {Number} bounds.top
 * @return {Number} bounds.left
 * @return {Number} bounds.width
 * @return {Number} bounds.height
 */


function rect2bnd(rect) {
  const $document = external_jQuery_default()(document);
  return {
    top: rect.top + $document.scrollTop(),
    left: rect.left + $document.scrollLeft(),
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };
}
/**
 * returns a copy of the object where the keys have become the values and the values the keys.
 * @param {Object} obj
 * @return {Object}
 */


function invertObject(obj) {
  const inverted = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      inverted[obj[key]] = key;
    }
  }

  return inverted;
}
/**
 * @param {String} namespace
 * @param {String} [prefix]
 * @return {String}
 */


function namespaceToCamel(namespace, prefix) {
  prefix = prefix || '';
  return prefix + namespace.split('.').map(function (name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }).join('');
}
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @return {Function}
 */


function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;

    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
/**
 *
 * @param {String} url
 * @return {Boolean}
 */


function isValidUrl(url) {
  const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return expression.test(url);
}

/* harmony default export */ var func = ({
  eq,
  eq2,
  peq2,
  ok,
  fail,
  self: func_self,
  not,
  and,
  invoke,
  resetUniqueId,
  uniqueId,
  rect2bnd,
  invertObject,
  namespaceToCamel,
  debounce,
  isValidUrl
});
// CONCATENATED MODULE: ./src/js/base/core/lists.js

/**
 * returns the first item of an array.
 *
 * @param {Array} array
 */

function lists_head(array) {
  return array[0];
}
/**
 * returns the last item of an array.
 *
 * @param {Array} array
 */


function lists_last(array) {
  return array[array.length - 1];
}
/**
 * returns everything but the last entry of the array.
 *
 * @param {Array} array
 */


function initial(array) {
  return array.slice(0, array.length - 1);
}
/**
 * returns the rest of the items in an array.
 *
 * @param {Array} array
 */


function tail(array) {
  return array.slice(1);
}
/**
 * returns item of array
 */


function find(array, pred) {
  for (let idx = 0, len = array.length; idx < len; idx++) {
    const item = array[idx];

    if (pred(item)) {
      return item;
    }
  }
}
/**
 * returns true if all of the values in the array pass the predicate truth test.
 */


function lists_all(array, pred) {
  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (!pred(array[idx])) {
      return false;
    }
  }

  return true;
}
/**
 * returns true if the value is present in the list.
 */


function contains(array, item) {
  if (array && array.length && item) {
    if (array.indexOf) {
      return array.indexOf(item) !== -1;
    } else if (array.contains) {
      // `DOMTokenList` doesn't implement `.indexOf`, but it implements `.contains`
      return array.contains(item);
    }
  }

  return false;
}
/**
 * get sum from a list
 *
 * @param {Array} array - array
 * @param {Function} fn - iterator
 */


function sum(array, fn) {
  fn = fn || func.self;
  return array.reduce(function (memo, v) {
    return memo + fn(v);
  }, 0);
}
/**
 * returns a copy of the collection with array type.
 * @param {Collection} collection - collection eg) node.childNodes, ...
 */


function from(collection) {
  const result = [];
  const length = collection.length;
  let idx = -1;

  while (++idx < length) {
    result[idx] = collection[idx];
  }

  return result;
}
/**
 * returns whether list is empty or not
 */


function isEmpty(array) {
  return !array || !array.length;
}
/**
 * cluster elements by predicate function.
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function for cluster rule
 * @param {Array[]}
 */


function clusterBy(array, fn) {
  if (!array.length) {
    return [];
  }

  const aTail = tail(array);
  return aTail.reduce(function (memo, v) {
    const aLast = lists_last(memo);

    if (fn(lists_last(aLast), v)) {
      aLast[aLast.length] = v;
    } else {
      memo[memo.length] = [v];
    }

    return memo;
  }, [[lists_head(array)]]);
}
/**
 * returns a copy of the array with all false values removed
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function for cluster rule
 */


function compact(array) {
  const aResult = [];

  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (array[idx]) {
      aResult.push(array[idx]);
    }
  }

  return aResult;
}
/**
 * produces a duplicate-free version of the array
 *
 * @param {Array} array
 */


function unique(array) {
  const results = [];

  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (!contains(results, array[idx])) {
      results.push(array[idx]);
    }
  }

  return results;
}
/**
 * returns next item.
 * @param {Array} array
 */


function lists_next(array, item) {
  if (array && array.length && item) {
    const idx = array.indexOf(item);
    return idx === -1 ? null : array[idx + 1];
  }

  return null;
}
/**
 * returns prev item.
 * @param {Array} array
 */


function prev(array, item) {
  if (array && array.length && item) {
    const idx = array.indexOf(item);
    return idx === -1 ? null : array[idx - 1];
  }

  return null;
}
/**
 * @class core.list
 *
 * list utils
 *
 * @singleton
 * @alternateClassName list
 */


/* harmony default export */ var lists = ({
  head: lists_head,
  last: lists_last,
  initial,
  tail,
  prev,
  next: lists_next,
  find,
  contains,
  all: lists_all,
  sum,
  from,
  isEmpty,
  clusterBy,
  compact,
  unique
});
// CONCATENATED MODULE: ./src/js/base/core/dom.js




const NBSP_CHAR = String.fromCharCode(160);
const ZERO_WIDTH_NBSP_CHAR = '\ufeff';
/**
 * @method isEditable
 *
 * returns whether node is `note-editable` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isEditable(node) {
  return node && external_jQuery_default()(node).hasClass('note-editable');
}
/**
 * @method isControlSizing
 *
 * returns whether node is `note-control-sizing` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */


function isControlSizing(node) {
  return node && external_jQuery_default()(node).hasClass('note-control-sizing');
}
/**
 * @method makePredByNodeName
 *
 * returns predicate which judge whether nodeName is same
 *
 * @param {String} nodeName
 * @return {Function}
 */


function makePredByNodeName(nodeName) {
  nodeName = nodeName.toUpperCase();
  return function (node) {
    return node && node.nodeName.toUpperCase() === nodeName;
  };
}
/**
 * @method isText
 *
 *
 *
 * @param {Node} node
 * @return {Boolean} true if node's type is text(3)
 */


function isText(node) {
  return node && node.nodeType === 3;
}
/**
 * @method isElement
 *
 *
 *
 * @param {Node} node
 * @return {Boolean} true if node's type is element(1)
 */


function isElement(node) {
  return node && node.nodeType === 1;
}
/**
 * ex) br, col, embed, hr, img, input, ...
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */


function isVoid(node) {
  return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
}

function isPara(node) {
  if (isEditable(node)) {
    return false;
  } // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph


  return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
}

function isHeading(node) {
  return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
}

const isPre = makePredByNodeName('PRE');
const isLi = makePredByNodeName('LI');

function isPurePara(node) {
  return isPara(node) && !isLi(node);
}

const isTable = makePredByNodeName('TABLE');
const isData = makePredByNodeName('DATA');

function dom_isInline(node) {
  return !isBodyContainer(node) && !isList(node) && !isHr(node) && !isPara(node) && !isTable(node) && !isBlockquote(node) && !isData(node);
}

function isList(node) {
  return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
}

const isHr = makePredByNodeName('HR');

function dom_isCell(node) {
  return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
}

const isBlockquote = makePredByNodeName('BLOCKQUOTE');

function isBodyContainer(node) {
  return dom_isCell(node) || isBlockquote(node) || isEditable(node);
}

const isAnchor = makePredByNodeName('A');

function isParaInline(node) {
  return dom_isInline(node) && !!dom_ancestor(node, isPara);
}

function isBodyInline(node) {
  return dom_isInline(node) && !dom_ancestor(node, isPara);
}

const isBody = makePredByNodeName('BODY');
/**
 * returns whether nodeB is closest sibling of nodeA
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @return {Boolean}
 */

function isClosestSibling(nodeA, nodeB) {
  return nodeA.nextSibling === nodeB || nodeA.previousSibling === nodeB;
}
/**
 * returns array of closest siblings with node
 *
 * @param {Node} node
 * @param {function} [pred] - predicate function
 * @return {Node[]}
 */


function withClosestSiblings(node, pred) {
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
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 */


const blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';
/**
 * @method nodeLength
 *
 * returns #text's text size or element's childNodes size
 *
 * @param {Node} node
 */

function nodeLength(node) {
  if (isText(node)) {
    return node.nodeValue.length;
  }

  if (node) {
    return node.childNodes.length;
  }

  return 0;
}
/**
 * returns whether deepest child node is empty or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */


function deepestChildIsEmpty(node) {
  do {
    if (node.firstElementChild === null || node.firstElementChild.innerHTML === '') break;
  } while (node = node.firstElementChild);

  return dom_isEmpty(node);
}
/**
 * returns whether node is empty or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */


function dom_isEmpty(node) {
  const len = nodeLength(node);

  if (len === 0) {
    return true;
  } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
    // ex) <p><br></p>, <span><br></span>
    return true;
  } else if (lists.all(node.childNodes, isText) && node.innerHTML === '') {
    // ex) <p></p>, <span></span>
    return true;
  }

  return false;
}
/**
 * padding blankHTML if node is empty (for cursor position)
 */


function paddingBlankHTML(node) {
  if (!isVoid(node) && !nodeLength(node)) {
    node.innerHTML = blankHTML;
  }
}
/**
 * find nearest ancestor predicate hit
 *
 * @param {Node} node
 * @param {Function} pred - predicate function
 */


function dom_ancestor(node, pred) {
  while (node) {
    if (pred(node)) {
      return node;
    }

    if (isEditable(node)) {
      break;
    }

    node = node.parentNode;
  }

  return null;
}
/**
 * find nearest ancestor only single child blood line and predicate hit
 *
 * @param {Node} node
 * @param {Function} pred - predicate function
 */


function singleChildAncestor(node, pred) {
  node = node.parentNode;

  while (node) {
    if (nodeLength(node) !== 1) {
      break;
    }

    if (pred(node)) {
      return node;
    }

    if (isEditable(node)) {
      break;
    }

    node = node.parentNode;
  }

  return null;
}
/**
 * returns new array of ancestor nodes (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */


function listAncestor(node, pred) {
  pred = pred || func.fail;
  const ancestors = [];
  dom_ancestor(node, function (el) {
    if (!isEditable(el)) {
      ancestors.push(el);
    }

    return pred(el);
  });
  return ancestors;
}
/**
 * find farthest ancestor predicate hit
 */


function lastAncestor(node, pred) {
  const ancestors = listAncestor(node);
  return lists.last(ancestors.filter(pred));
}
/**
 * returns common ancestor node between two nodes.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 */


function commonAncestor(nodeA, nodeB) {
  const ancestors = listAncestor(nodeA);

  for (let n = nodeB; n; n = n.parentNode) {
    if (ancestors.indexOf(n) > -1) return n;
  }

  return null; // difference document area
}
/**
 * listing all previous siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */


function listPrev(node, pred) {
  pred = pred || func.fail;
  const nodes = [];

  while (node) {
    if (pred(node)) {
      break;
    }

    nodes.push(node);
    node = node.previousSibling;
  }

  return nodes;
}
/**
 * listing next siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */


function listNext(node, pred) {
  pred = pred || func.fail;
  const nodes = [];

  while (node) {
    if (pred(node)) {
      break;
    }

    nodes.push(node);
    node = node.nextSibling;
  }

  return nodes;
}
/**
 * listing descendant nodes
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */


function listDescendant(node, pred) {
  const descendants = [];
  pred = pred || func.ok; // start DFS(depth first search) with node

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


function wrap(node, wrapperName) {
  const parent = node.parentNode;
  const wrapper = external_jQuery_default()('<' + wrapperName + '>')[0];
  parent.insertBefore(wrapper, node);
  wrapper.appendChild(node);
  return wrapper;
}
/**
 * insert node after preceding
 *
 * @param {Node} node
 * @param {Node} preceding - predicate function
 */


function insertAfter(node, preceding) {
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
 *
 * @param {Node} node
 * @param {Collection} aChild
 */


function appendChildNodes(node, aChild) {
  external_jQuery_default.a.each(aChild, function (idx, child) {
    node.appendChild(child);
  });
  return node;
}
/**
 * returns whether boundaryPoint is left edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isLeftEdgePoint(point) {
  return point.offset === 0;
}
/**
 * returns whether boundaryPoint is right edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isRightEdgePoint(point) {
  return point.offset === nodeLength(point.node);
}
/**
 * returns whether boundaryPoint is edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isEdgePoint(point) {
  return isLeftEdgePoint(point) || isRightEdgePoint(point);
}
/**
 * returns whether node is left edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Boolean}
 */


function isLeftEdgeOf(node, ancestor) {
  while (node && node !== ancestor) {
    if (dom_position(node) !== 0) {
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


function isRightEdgeOf(node, ancestor) {
  if (!ancestor) {
    return false;
  }

  while (node && node !== ancestor) {
    if (dom_position(node) !== nodeLength(node.parentNode) - 1) {
      return false;
    }

    node = node.parentNode;
  }

  return true;
}
/**
 * returns whether point is left edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */


function isLeftEdgePointOf(point, ancestor) {
  return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
}
/**
 * returns whether point is right edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */


function isRightEdgePointOf(point, ancestor) {
  return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
}
/**
 * returns offset from parent.
 *
 * @param {Node} node
 */


function dom_position(node) {
  let offset = 0;

  while (node = node.previousSibling) {
    offset += 1;
  }

  return offset;
}

function hasChildren(node) {
  return !!(node && node.childNodes && node.childNodes.length);
}
/**
 * returns previous boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 */


function dom_prevPoint(point, isSkipInnerOffset) {
  let node;
  let offset;

  if (point.offset === 0) {
    if (isEditable(point.node)) {
      return null;
    }

    node = point.node.parentNode;
    offset = dom_position(point.node);
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset - 1];
    offset = nodeLength(node);
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? 0 : point.offset - 1;
  }

  return {
    node: node,
    offset: offset
  };
}
/**
 * returns next boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 */


function dom_nextPoint(point, isSkipInnerOffset) {
  let node, offset;

  if (dom_isEmpty(point.node)) {
    return null;
  }

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      return null;
    }

    node = point.node.parentNode;
    offset = dom_position(point.node) + 1;
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;

    if (dom_isEmpty(node)) {
      return null;
    }
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;

    if (dom_isEmpty(node)) {
      return null;
    }
  }

  return {
    node: node,
    offset: offset
  };
}
/**
 * returns whether pointA and pointB is same or not.
 *
 * @param {BoundaryPoint} pointA
 * @param {BoundaryPoint} pointB
 * @return {Boolean}
 */


function isSamePoint(pointA, pointB) {
  return pointA.node === pointB.node && pointA.offset === pointB.offset;
}
/**
 * returns whether point is visible (can set cursor) or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */


function isVisiblePoint(point) {
  if (isText(point.node) || !hasChildren(point.node) || dom_isEmpty(point.node)) {
    return true;
  }

  const leftNode = point.node.childNodes[point.offset - 1];
  const rightNode = point.node.childNodes[point.offset];

  if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
    return true;
  }

  return false;
}
/**
 * @method prevPointUtil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 * @return {BoundaryPoint}
 */


function prevPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = dom_prevPoint(point);
  }

  return null;
}
/**
 * @method nextPointUntil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 * @return {BoundaryPoint}
 */


function nextPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = dom_nextPoint(point);
  }

  return null;
}
/**
 * returns whether point has character or not.
 *
 * @param {Point} point
 * @return {Boolean}
 */


function isCharPoint(point) {
  if (!isText(point.node)) {
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  return ch && ch !== ' ' && ch !== NBSP_CHAR;
}
/**
 * returns whether point has space or not.
 *
 * @param {Point} point
 * @return {Boolean}
 */


function isSpacePoint(point) {
  if (!isText(point.node)) {
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  return ch === ' ' || ch === NBSP_CHAR;
}

;
/**
 * @method walkPoint
 *
 * @param {BoundaryPoint} startPoint
 * @param {BoundaryPoint} endPoint
 * @param {Function} handler
 * @param {Boolean} isSkipInnerOffset
 */

function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
  let point = startPoint;

  while (point) {
    handler(point);

    if (isSamePoint(point, endPoint)) {
      break;
    }

    const isSkipOffset = isSkipInnerOffset && startPoint.node !== point.node && endPoint.node !== point.node;
    point = dom_nextPoint(point, isSkipOffset);
  }
}
/**
 * @method makeOffsetPath
 *
 * return offsetPath(array of offset) from ancestor
 *
 * @param {Node} ancestor - ancestor node
 * @param {Node} node
 */


function makeOffsetPath(ancestor, node) {
  const ancestors = listAncestor(node, func.eq(ancestor));
  return ancestors.map(dom_position).reverse();
}
/**
 * @method fromOffsetPath
 *
 * return element from offsetPath(array of offset)
 *
 * @param {Node} ancestor - ancestor node
 * @param {array} offsets - offsetPath
 */


function fromOffsetPath(ancestor, offsets) {
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
 * @method splitNode
 *
 * split element or #text
 *
 * @param {BoundaryPoint} point
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @param {Boolean} [options.isDiscardEmptySplits] - default: false
 * @return {Node} right node of boundaryPoint
 */


function splitNode(point, options) {
  let isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
  const isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
  const isDiscardEmptySplits = options && options.isDiscardEmptySplits;

  if (isDiscardEmptySplits) {
    isSkipPaddingBlankHTML = true;
  } // edge case


  if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
    if (isLeftEdgePoint(point)) {
      return point.node;
    } else if (isRightEdgePoint(point)) {
      return point.node.nextSibling;
    }
  } // split #text


  if (isText(point.node)) {
    return point.node.splitText(point.offset);
  } else {
    const childNode = point.node.childNodes[point.offset];
    const clone = insertAfter(point.node.cloneNode(false), point.node);
    appendChildNodes(clone, listNext(childNode));

    if (!isSkipPaddingBlankHTML) {
      paddingBlankHTML(point.node);
      paddingBlankHTML(clone);
    }

    if (isDiscardEmptySplits) {
      if (dom_isEmpty(point.node)) {
        remove(point.node);
      }

      if (dom_isEmpty(clone)) {
        remove(clone);
        return point.node.nextSibling;
      }
    }

    return clone;
  }
}
/**
 * @method splitTree
 *
 * split tree by point
 *
 * @param {Node} root - split root
 * @param {BoundaryPoint} point
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @return {Node} right node of boundaryPoint
 */


function splitTree(root, point, options) {
  // ex) [#text, <span>, <p>]
  const ancestors = listAncestor(point.node, func.eq(root));

  if (!ancestors.length) {
    return null;
  } else if (ancestors.length === 1) {
    return splitNode(point, options);
  }

  return ancestors.reduce(function (node, parent) {
    if (node === point.node) {
      node = splitNode(point, options);
    }

    return splitNode({
      node: parent,
      offset: node ? dom_position(node) : nodeLength(parent)
    }, options);
  });
}
/**
 * split point
 *
 * @param {Point} point
 * @param {Boolean} isInline
 * @return {Object}
 */


function splitPoint(point, isInline) {
  // find splitRoot, container
  //  - inline: splitRoot is a child of paragraph
  //  - block: splitRoot is a child of bodyContainer
  const pred = isInline ? isPara : isBodyContainer;
  const ancestors = listAncestor(point.node, pred);
  const topAncestor = lists.last(ancestors) || point.node;
  let splitRoot, container;

  if (pred(topAncestor)) {
    splitRoot = ancestors[ancestors.length - 2];
    container = topAncestor;
  } else {
    splitRoot = topAncestor;
    container = splitRoot.parentNode;
  } // if splitRoot is exists, split with splitTree


  let pivot = splitRoot && splitTree(splitRoot, point, {
    isSkipPaddingBlankHTML: isInline,
    isNotSplitEdgePoint: isInline
  }); // if container is point.node, find pivot with point.offset

  if (!pivot && container === point.node) {
    pivot = point.node.childNodes[point.offset];
  }

  return {
    rightNode: pivot,
    container: container
  };
}

function create(nodeName) {
  return document.createElement(nodeName);
}

function createText(text) {
  return document.createTextNode(text);
}
/**
 * @method remove
 *
 * remove node, (isRemoveChild: remove child or not)
 *
 * @param {Node} node
 * @param {Boolean} isRemoveChild
 */


function remove(node, isRemoveChild) {
  if (!node || !node.parentNode) {
    return;
  }

  if (node.removeNode) {
    return node.removeNode(isRemoveChild);
  }

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
/**
 * @method removeWhile
 *
 * @param {Node} node
 * @param {Function} pred
 */


function removeWhile(node, pred) {
  while (node) {
    if (isEditable(node) || !pred(node)) {
      break;
    }

    const parent = node.parentNode;
    remove(node);
    node = parent;
  }
}
/**
 * @method replace
 *
 * replace node with provided nodeName
 *
 * @param {Node} node
 * @param {String} nodeName
 * @return {Node} - new node
 */


function replace(node, nodeName) {
  if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
    return node;
  }

  const newNode = create(nodeName);

  if (node.style.cssText) {
    newNode.style.cssText = node.style.cssText;
  }

  appendChildNodes(newNode, lists.from(node.childNodes));
  insertAfter(newNode, node);
  remove(node);
  return newNode;
}

const isTextarea = makePredByNodeName('TEXTAREA');
/**
 * @param {jQuery} $node
 * @param {Boolean} [stripLinebreaks] - default: false
 */

function dom_value($node, stripLinebreaks) {
  const val = isTextarea($node[0]) ? $node.val() : $node.html();

  if (stripLinebreaks) {
    return val.replace(/[\n\r]/g, '');
  }

  return val;
}
/**
 * @method html
 *
 * get the HTML contents of node
 *
 * @param {jQuery} $node
 * @param {Boolean} [isNewlineOnBlock]
 */


function dom_html($node, isNewlineOnBlock) {
  let markup = dom_value($node);

  if (isNewlineOnBlock) {
    const regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
    markup = markup.replace(regexTag, function (match, endSlash, name) {
      name = name.toUpperCase();
      const isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) && !!endSlash;
      const isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
      return match + (isEndOfInlineContainer || isBlockNode ? '\n' : '');
    });
    markup = markup.trim();
  }

  return markup;
}

function posFromPlaceholder(placeholder) {
  const $placeholder = external_jQuery_default()(placeholder);
  const pos = $placeholder.offset();
  const height = $placeholder.outerHeight(true); // include margin

  return {
    left: pos.left,
    top: pos.top + height
  };
}

function attachEvents($node, events) {
  Object.keys(events).forEach(function (key) {
    $node.on(key, events[key]);
  });
}

function detachEvents($node, events) {
  Object.keys(events).forEach(function (key) {
    $node.off(key, events[key]);
  });
}
/**
 * @method isCustomStyleTag
 *
 * assert if a node contains a "note-styletag" class,
 * which implies that's a custom-made style tag node
 *
 * @param {Node} an HTML DOM node
 */


function isCustomStyleTag(node) {
  return node && !isText(node) && lists.contains(node.classList, 'note-styletag');
}

/* harmony default export */ var dom = ({
  /** @property {String} NBSP_CHAR */
  NBSP_CHAR,

  /** @property {String} ZERO_WIDTH_NBSP_CHAR */
  ZERO_WIDTH_NBSP_CHAR,

  /** @property {String} blank */
  blank: blankHTML,

  /** @property {String} emptyPara */
  emptyPara: `<p>${blankHTML}</p>`,
  makePredByNodeName,
  isEditable,
  isControlSizing,
  isText,
  isElement,
  isVoid,
  isPara,
  isPurePara,
  isHeading,
  isInline: dom_isInline,
  isBlock: func.not(dom_isInline),
  isBodyInline,
  isBody,
  isParaInline,
  isPre,
  isList,
  isTable,
  isData,
  isCell: dom_isCell,
  isBlockquote,
  isBodyContainer,
  isAnchor,
  isDiv: makePredByNodeName('DIV'),
  isLi,
  isBR: makePredByNodeName('BR'),
  isSpan: makePredByNodeName('SPAN'),
  isB: makePredByNodeName('B'),
  isU: makePredByNodeName('U'),
  isS: makePredByNodeName('S'),
  isI: makePredByNodeName('I'),
  isImg: makePredByNodeName('IMG'),
  isTextarea,
  deepestChildIsEmpty,
  isEmpty: dom_isEmpty,
  isEmptyAnchor: func.and(isAnchor, dom_isEmpty),
  isClosestSibling,
  withClosestSiblings,
  nodeLength,
  isLeftEdgePoint,
  isRightEdgePoint,
  isEdgePoint,
  isLeftEdgeOf,
  isRightEdgeOf,
  isLeftEdgePointOf,
  isRightEdgePointOf,
  prevPoint: dom_prevPoint,
  nextPoint: dom_nextPoint,
  isSamePoint,
  isVisiblePoint,
  prevPointUntil,
  nextPointUntil,
  isCharPoint,
  isSpacePoint,
  walkPoint,
  ancestor: dom_ancestor,
  singleChildAncestor,
  listAncestor,
  lastAncestor,
  listNext,
  listPrev,
  listDescendant,
  commonAncestor,
  wrap,
  insertAfter,
  appendChildNodes,
  position: dom_position,
  hasChildren,
  makeOffsetPath,
  fromOffsetPath,
  splitTree,
  splitPoint,
  create,
  createText,
  remove,
  removeWhile,
  replace,
  html: dom_html,
  value: dom_value,
  posFromPlaceholder,
  attachEvents,
  detachEvents,
  isCustomStyleTag
});
// CONCATENATED MODULE: ./src/js/base/Context.js




class Context_Context {
  /**
   * @param {jQuery} $note
   * @param {Object} options
   */
  constructor($note, options) {
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$note = $note;
    this.memos = {};
    this.modules = {};
    this.layoutInfo = {};
    this.options = external_jQuery_default.a.extend(true, {}, options);
    this.initialize();
  }
  /**
   * create layout and initialize modules and other resources
   */


  initialize() {
    this.layoutInfo = this.ui.createLayout(this.$note, this.options);

    this._initialize();

    this.$note.hide();
    return this;
  }
  /**
   * destroy modules and other resources and remove layout
   */


  destroy() {
    this._destroy();

    this.$note.removeData('summernote');
    this.ui.removeLayout(this.$note, this.layoutInfo);
  }
  /**
   * destory modules and other resources and initialize it again
   */


  reset() {
    const disabled = this.isDisabled();
    this.code(dom.emptyPara);

    this._destroy();

    this._initialize();

    if (disabled) {
      this.disable();
    }
  }

  _initialize() {
    // set own id
    this.options.id = func.uniqueId(external_jQuery_default.a.now()); // set default container for tooltips, popovers, and dialogs

    this.options.container = this.options.container || this.layoutInfo.editor; // add optional buttons

    const buttons = external_jQuery_default.a.extend({}, this.options.buttons);
    Object.keys(buttons).forEach(key => {
      this.memo('button.' + key, buttons[key]);
    });
    const modules = external_jQuery_default.a.extend({}, this.options.modules, external_jQuery_default.a.summernote.plugins || {}); // add and initialize modules

    Object.keys(modules).forEach(key => {
      this.module(key, modules[key], true);
    });
    Object.keys(this.modules).forEach(key => {
      this.initializeModule(key);
    });
  }

  _destroy() {
    // destroy modules with reversed order
    Object.keys(this.modules).reverse().forEach(key => {
      this.removeModule(key);
    });
    Object.keys(this.memos).forEach(key => {
      this.removeMemo(key);
    }); // trigger custom onDestroy callback

    this.triggerEvent('destroy', this);
  }

  code(html) {
    const isActivated = this.invoke('codeview.isActivated');

    if (html === undefined) {
      this.invoke('codeview.sync');
      return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
    } else {
      if (isActivated) {
        this.layoutInfo.codable.val(html);
      } else {
        this.layoutInfo.editable.html(html);
      }

      this.$note.val(html);
      this.triggerEvent('change', html, this.layoutInfo.editable);
    }
  }

  isDisabled() {
    return this.layoutInfo.editable.attr('contenteditable') === 'false';
  }

  enable() {
    this.layoutInfo.editable.attr('contenteditable', true);
    this.invoke('toolbar.activate', true);
    this.triggerEvent('disable', false);
    this.options.editing = true;
  }

  disable() {
    // close codeview if codeview is opend
    if (this.invoke('codeview.isActivated')) {
      this.invoke('codeview.deactivate');
    }

    this.layoutInfo.editable.attr('contenteditable', false);
    this.options.editing = false;
    this.invoke('toolbar.deactivate', true);
    this.triggerEvent('disable', true);
  }

  triggerEvent() {
    const namespace = lists.head(arguments);
    const args = lists.tail(lists.from(arguments));
    const callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];

    if (callback) {
      callback.apply(this.$note[0], args);
    }

    this.$note.trigger('summernote.' + namespace, args);
  }

  initializeModule(key) {
    const module = this.modules[key];
    module.shouldInitialize = module.shouldInitialize || func.ok;

    if (!module.shouldInitialize()) {
      return;
    } // initialize module


    if (module.initialize) {
      module.initialize();
    } // attach events


    if (module.events) {
      dom.attachEvents(this.$note, module.events);
    }
  }

  module(key, ModuleClass, withoutIntialize) {
    if (arguments.length === 1) {
      return this.modules[key];
    }

    this.modules[key] = new ModuleClass(this);

    if (!withoutIntialize) {
      this.initializeModule(key);
    }
  }

  removeModule(key) {
    const module = this.modules[key];

    if (module.shouldInitialize()) {
      if (module.events) {
        dom.detachEvents(this.$note, module.events);
      }

      if (module.destroy) {
        module.destroy();
      }
    }

    delete this.modules[key];
  }

  memo(key, obj) {
    if (arguments.length === 1) {
      return this.memos[key];
    }

    this.memos[key] = obj;
  }

  removeMemo(key) {
    if (this.memos[key] && this.memos[key].destroy) {
      this.memos[key].destroy();
    }

    delete this.memos[key];
  }
  /**
   * Some buttons need to change their visual style immediately once they get pressed
   */


  createInvokeHandlerAndUpdateState(namespace, value) {
    return event => {
      this.createInvokeHandler(namespace, value)(event);
      this.invoke('buttons.updateCurrentStyle');
    };
  }

  createInvokeHandler(namespace, value) {
    return event => {
      event.preventDefault();
      const $target = external_jQuery_default()(event.target);
      this.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
    };
  }

  invoke() {
    const namespace = lists.head(arguments);
    const args = lists.tail(lists.from(arguments));
    const splits = namespace.split('.');
    const hasSeparator = splits.length > 1;
    const moduleName = hasSeparator && lists.head(splits);
    const methodName = hasSeparator ? lists.last(splits) : lists.head(splits);
    const module = this.modules[moduleName || 'editor'];

    if (!moduleName && this[methodName]) {
      return this[methodName].apply(this, args);
    } else if (module && module[methodName] && module.shouldInitialize()) {
      return module[methodName].apply(module, args);
    }
  }

}
// CONCATENATED MODULE: ./src/js/summernote.js




external_jQuery_default.a.fn.extend({
  /**
   * Summernote API
   *
   * @param {Object|String}
   * @return {this}
   */
  summernote: function () {
    const type = external_jQuery_default.a.type(lists.head(arguments));
    const isExternalAPICalled = type === 'string';
    const hasInitOptions = type === 'object';
    const options = external_jQuery_default.a.extend({}, external_jQuery_default.a.summernote.options, hasInitOptions ? lists.head(arguments) : {}); // Update options

    options.langInfo = external_jQuery_default.a.extend(true, {}, external_jQuery_default.a.summernote.lang['en-US'], external_jQuery_default.a.summernote.lang[options.lang]);
    options.icons = external_jQuery_default.a.extend(true, {}, external_jQuery_default.a.summernote.options.icons, options.icons);
    options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;
    this.each((idx, note) => {
      const $note = external_jQuery_default()(note);

      if (!$note.data('summernote')) {
        const context = new Context_Context($note, options);
        $note.data('summernote', context);
        $note.data('summernote').triggerEvent('init', context.layoutInfo);
      }
    });
    const $note = this.first();

    if ($note.length) {
      const context = $note.data('summernote');

      if (isExternalAPICalled) {
        return context.invoke.apply(context, lists.from(arguments));
      } else if (options.focus) {
        context.invoke('editor.focus');
      }
    }

    return this;
  }
});
// CONCATENATED MODULE: ./src/js/base/core/range.js





/**
 * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
 *
 * @param {TextRange} textRange
 * @param {Boolean} isStart
 * @return {BoundaryPoint}
 *
 * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
 */

function textRangeToPoint(textRange, isStart) {
  let container = textRange.parentElement();
  let offset;
  const tester = document.body.createTextRange();
  let prevContainer;
  const childNodes = lists.from(container.childNodes);

  for (offset = 0; offset < childNodes.length; offset++) {
    if (dom.isText(childNodes[offset])) {
      continue;
    }

    tester.moveToElementText(childNodes[offset]);

    if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
      break;
    }

    prevContainer = childNodes[offset];
  }

  if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
    const textRangeStart = document.body.createTextRange();
    let curTextNode = null;
    textRangeStart.moveToElementText(prevContainer || container);
    textRangeStart.collapse(!prevContainer);
    curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
    const pointTester = textRange.duplicate();
    pointTester.setEndPoint('StartToStart', textRangeStart);
    let textCount = pointTester.text.replace(/[\r\n]/g, '').length;

    while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    } // [workaround] enforce IE to re-reference curTextNode, hack


    const dummy = curTextNode.nodeValue; // eslint-disable-line

    if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) && textCount === curTextNode.nodeValue.length) {
      textCount -= curTextNode.nodeValue.length;
      curTextNode = curTextNode.nextSibling;
    }

    container = curTextNode;
    offset = textCount;
  }

  return {
    cont: container,
    offset: offset
  };
}
/**
 * return TextRange from boundary point (inspired by google closure-library)
 * @param {BoundaryPoint} point
 * @return {TextRange}
 */


function pointToTextRange(point) {
  const textRangeInfo = function (container, offset) {
    let node, isCollapseToStart;

    if (dom.isText(container)) {
      const prevTextNodes = dom.listPrev(container, func.not(dom.isText));
      const prevContainer = lists.last(prevTextNodes).previousSibling;
      node = prevContainer || container.parentNode;
      offset += lists.sum(lists.tail(prevTextNodes), dom.nodeLength);
      isCollapseToStart = !prevContainer;
    } else {
      node = container.childNodes[offset] || container;

      if (dom.isText(node)) {
        return textRangeInfo(node, 0);
      }

      offset = 0;
      isCollapseToStart = false;
    }

    return {
      node: node,
      collapseToStart: isCollapseToStart,
      offset: offset
    };
  };

  const textRange = document.body.createTextRange();
  const info = textRangeInfo(point.node, point.offset);
  textRange.moveToElementText(info.node);
  textRange.collapse(info.collapseToStart);
  textRange.moveStart('character', info.offset);
  return textRange;
}
/**
   * Wrapped Range
   *
   * @constructor
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   */


class range_WrappedRange {
  constructor(sc, so, ec, eo) {
    this.sc = sc;
    this.so = so;
    this.ec = ec;
    this.eo = eo; // isOnEditable: judge whether range is on editable or not

    this.isOnEditable = this.makeIsOn(dom.isEditable); // isOnList: judge whether range is on list node or not

    this.isOnList = this.makeIsOn(dom.isList); // isOnAnchor: judge whether range is on anchor node or not

    this.isOnAnchor = this.makeIsOn(dom.isAnchor); // isOnCell: judge whether range is on cell node or not

    this.isOnCell = this.makeIsOn(dom.isCell); // isOnData: judge whether range is on data node or not

    this.isOnData = this.makeIsOn(dom.isData);
  } // nativeRange: get nativeRange from sc, so, ec, eo


  nativeRange() {
    if (env.isW3CRangeSupport) {
      const w3cRange = document.createRange();
      w3cRange.setStart(this.sc, this.sc.data && this.so > this.sc.data.length ? 0 : this.so);
      w3cRange.setEnd(this.ec, this.sc.data ? Math.min(this.eo, this.sc.data.length) : this.eo);
      return w3cRange;
    } else {
      const textRange = pointToTextRange({
        node: this.sc,
        offset: this.so
      });
      textRange.setEndPoint('EndToEnd', pointToTextRange({
        node: this.ec,
        offset: this.eo
      }));
      return textRange;
    }
  }

  getPoints() {
    return {
      sc: this.sc,
      so: this.so,
      ec: this.ec,
      eo: this.eo
    };
  }

  getStartPoint() {
    return {
      node: this.sc,
      offset: this.so
    };
  }

  getEndPoint() {
    return {
      node: this.ec,
      offset: this.eo
    };
  }
  /**
   * select update visible range
   */


  select() {
    const nativeRng = this.nativeRange();

    if (env.isW3CRangeSupport) {
      const selection = document.getSelection();

      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }

      selection.addRange(nativeRng);
    } else {
      nativeRng.select();
    }

    return this;
  }
  /**
   * Moves the scrollbar to start container(sc) of current range
   *
   * @return {WrappedRange}
   */


  scrollIntoView(container) {
    const height = external_jQuery_default()(container).height();

    if (container.scrollTop + height < this.sc.offsetTop) {
      container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
    }

    return this;
  }
  /**
   * @return {WrappedRange}
   */


  normalize() {
    /**
     * @param {BoundaryPoint} point
     * @param {Boolean} isLeftToRight - true: prefer to choose right node
     *                                - false: prefer to choose left node
     * @return {BoundaryPoint}
     */
    const getVisiblePoint = function (point, isLeftToRight) {
      if (!point) {
        return point;
      } // Just use the given point [XXX:Adhoc]
      //  - case 01. if the point is on the middle of the node
      //  - case 02. if the point is on the right edge and prefer to choose left node
      //  - case 03. if the point is on the left edge and prefer to choose right node
      //  - case 04. if the point is on the right edge and prefer to choose right node but the node is void
      //  - case 05. if the point is on the left edge and prefer to choose left node but the node is void
      //  - case 06. if the point is on the block node and there is no children


      if (dom.isVisiblePoint(point)) {
        if (!dom.isEdgePoint(point) || dom.isRightEdgePoint(point) && !isLeftToRight || dom.isLeftEdgePoint(point) && isLeftToRight || dom.isRightEdgePoint(point) && isLeftToRight && dom.isVoid(point.node.nextSibling) || dom.isLeftEdgePoint(point) && !isLeftToRight && dom.isVoid(point.node.previousSibling) || dom.isBlock(point.node) && dom.isEmpty(point.node)) {
          return point;
        }
      } // point on block's edge


      const block = dom.ancestor(point.node, dom.isBlock);
      let hasRightNode = false;

      if (!hasRightNode) {
        const prevPoint = dom.prevPoint(point) || {
          node: null
        };
        hasRightNode = (dom.isLeftEdgePointOf(point, block) || dom.isVoid(prevPoint.node)) && !isLeftToRight;
      }

      let hasLeftNode = false;

      if (!hasLeftNode) {
        const nextPoint = dom.nextPoint(point) || {
          node: null
        };
        hasLeftNode = (dom.isRightEdgePointOf(point, block) || dom.isVoid(nextPoint.node)) && isLeftToRight;
      }

      if (hasRightNode || hasLeftNode) {
        // returns point already on visible point
        if (dom.isVisiblePoint(point)) {
          return point;
        } // reverse direction


        isLeftToRight = !isLeftToRight;
      }

      const nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint) : dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
      return nextPoint || point;
    };

    const endPoint = getVisiblePoint(this.getEndPoint(), false);
    const startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);
    return new range_WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
  }
  /**
   * returns matched nodes on range
   *
   * @param {Function} [pred] - predicate function
   * @param {Object} [options]
   * @param {Boolean} [options.includeAncestor]
   * @param {Boolean} [options.fullyContains]
   * @return {Node[]}
   */


  nodes(pred, options) {
    pred = pred || func.ok;
    const includeAncestor = options && options.includeAncestor;
    const fullyContains = options && options.fullyContains; // TODO compare points and sort

    const startPoint = this.getStartPoint();
    const endPoint = this.getEndPoint();
    const nodes = [];
    const leftEdgeNodes = [];
    dom.walkPoint(startPoint, endPoint, function (point) {
      if (dom.isEditable(point.node)) {
        return;
      }

      let node;

      if (fullyContains) {
        if (dom.isLeftEdgePoint(point)) {
          leftEdgeNodes.push(point.node);
        }

        if (dom.isRightEdgePoint(point) && lists.contains(leftEdgeNodes, point.node)) {
          node = point.node;
        }
      } else if (includeAncestor) {
        node = dom.ancestor(point.node, pred);
      } else {
        node = point.node;
      }

      if (node && pred(node)) {
        nodes.push(node);
      }
    }, true);
    return lists.unique(nodes);
  }
  /**
   * returns commonAncestor of range
   * @return {Element} - commonAncestor
   */


  commonAncestor() {
    return dom.commonAncestor(this.sc, this.ec);
  }
  /**
   * returns expanded range by pred
   *
   * @param {Function} pred - predicate function
   * @return {WrappedRange}
   */


  expand(pred) {
    const startAncestor = dom.ancestor(this.sc, pred);
    const endAncestor = dom.ancestor(this.ec, pred);

    if (!startAncestor && !endAncestor) {
      return new range_WrappedRange(this.sc, this.so, this.ec, this.eo);
    }

    const boundaryPoints = this.getPoints();

    if (startAncestor) {
      boundaryPoints.sc = startAncestor;
      boundaryPoints.so = 0;
    }

    if (endAncestor) {
      boundaryPoints.ec = endAncestor;
      boundaryPoints.eo = dom.nodeLength(endAncestor);
    }

    return new range_WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
  }
  /**
   * @param {Boolean} isCollapseToStart
   * @return {WrappedRange}
   */


  collapse(isCollapseToStart) {
    if (isCollapseToStart) {
      return new range_WrappedRange(this.sc, this.so, this.sc, this.so);
    } else {
      return new range_WrappedRange(this.ec, this.eo, this.ec, this.eo);
    }
  }
  /**
   * splitText on range
   */


  splitText() {
    const isSameContainer = this.sc === this.ec;
    const boundaryPoints = this.getPoints();

    if (dom.isText(this.ec) && !dom.isEdgePoint(this.getEndPoint())) {
      this.ec.splitText(this.eo);
    }

    if (dom.isText(this.sc) && !dom.isEdgePoint(this.getStartPoint())) {
      boundaryPoints.sc = this.sc.splitText(this.so);
      boundaryPoints.so = 0;

      if (isSameContainer) {
        boundaryPoints.ec = boundaryPoints.sc;
        boundaryPoints.eo = this.eo - this.so;
      }
    }

    return new range_WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
  }
  /**
   * delete contents on range
   * @return {WrappedRange}
   */


  deleteContents() {
    if (this.isCollapsed()) {
      return this;
    }

    const rng = this.splitText();
    const nodes = rng.nodes(null, {
      fullyContains: true
    }); // find new cursor point

    const point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
      return !lists.contains(nodes, point.node);
    });
    const emptyParents = [];
    external_jQuery_default.a.each(nodes, function (idx, node) {
      // find empty parents
      const parent = node.parentNode;

      if (point.node !== parent && dom.nodeLength(parent) === 1) {
        emptyParents.push(parent);
      }

      dom.remove(node, false);
    }); // remove empty parents

    external_jQuery_default.a.each(emptyParents, function (idx, node) {
      dom.remove(node, false);
    });
    return new range_WrappedRange(point.node, point.offset, point.node, point.offset).normalize();
  }
  /**
   * makeIsOn: return isOn(pred) function
   */


  makeIsOn(pred) {
    return function () {
      const ancestor = dom.ancestor(this.sc, pred);
      return !!ancestor && ancestor === dom.ancestor(this.ec, pred);
    };
  }
  /**
   * @param {Function} pred
   * @return {Boolean}
   */


  isLeftEdgeOf(pred) {
    if (!dom.isLeftEdgePoint(this.getStartPoint())) {
      return false;
    }

    const node = dom.ancestor(this.sc, pred);
    return node && dom.isLeftEdgeOf(this.sc, node);
  }
  /**
   * returns whether range was collapsed or not
   */


  isCollapsed() {
    return this.sc === this.ec && this.so === this.eo;
  }
  /**
   * wrap inline nodes which children of body with paragraph
   *
   * @return {WrappedRange}
   */


  wrapBodyInlineWithPara() {
    if (dom.isBodyContainer(this.sc) && dom.isEmpty(this.sc)) {
      this.sc.innerHTML = dom.emptyPara;
      return new range_WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
    }
    /**
     * [workaround] firefox often create range on not visible point. so normalize here.
     *  - firefox: |<p>text</p>|
     *  - chrome: <p>|text|</p>
     */


    const rng = this.normalize();

    if (dom.isParaInline(this.sc) || dom.isPara(this.sc)) {
      return rng;
    } // find inline top ancestor


    let topAncestor;

    if (dom.isInline(rng.sc)) {
      const ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
      topAncestor = lists.last(ancestors);

      if (!dom.isInline(topAncestor)) {
        topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
      }
    } else {
      topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
    }

    if (topAncestor) {
      // siblings not in paragraph
      let inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
      inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline)); // wrap with paragraph

      if (inlineSiblings.length) {
        const para = dom.wrap(lists.head(inlineSiblings), 'p');
        dom.appendChildNodes(para, lists.tail(inlineSiblings));
      }
    }

    return this.normalize();
  }
  /**
   * insert node at current cursor
   *
   * @param {Node} node
   * @return {Node}
   */


  insertNode(node) {
    let rng = this;

    if (dom.isText(node) || dom.isInline(node)) {
      rng = this.wrapBodyInlineWithPara().deleteContents();
    }

    const info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));

    if (info.rightNode) {
      info.rightNode.parentNode.insertBefore(node, info.rightNode);
    } else {
      info.container.appendChild(node);
    }

    return node;
  }
  /**
   * insert html at current cursor
   */


  pasteHTML(markup) {
    markup = external_jQuery_default.a.trim(markup);
    const contentsContainer = external_jQuery_default()('<div></div>').html(markup)[0];
    let childNodes = lists.from(contentsContainer.childNodes); // const rng = this.wrapBodyInlineWithPara().deleteContents();

    const rng = this;

    if (rng.so >= 0) {
      childNodes = childNodes.reverse();
    }

    childNodes = childNodes.map(function (childNode) {
      return rng.insertNode(childNode);
    });

    if (rng.so > 0) {
      childNodes = childNodes.reverse();
    }

    return childNodes;
  }
  /**
   * returns text in range
   *
   * @return {String}
   */


  toString() {
    const nativeRng = this.nativeRange();
    return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
  }
  /**
   * returns range for word before cursor
   *
   * @param {Boolean} [findAfter] - find after cursor, default: false
   * @return {WrappedRange}
   */


  getWordRange(findAfter) {
    let endPoint = this.getEndPoint();

    if (!dom.isCharPoint(endPoint)) {
      return this;
    }

    const startPoint = dom.prevPointUntil(endPoint, function (point) {
      return !dom.isCharPoint(point);
    });

    if (findAfter) {
      endPoint = dom.nextPointUntil(endPoint, function (point) {
        return !dom.isCharPoint(point);
      });
    }

    return new range_WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
  }
  /**
   * returns range for words before cursor
   *
   * @param {Boolean} [findAfter] - find after cursor, default: false
   * @return {WrappedRange}
   */


  getWordsRange(findAfter) {
    var endPoint = this.getEndPoint();

    var isNotTextPoint = function (point) {
      return !dom.isCharPoint(point) && !dom.isSpacePoint(point);
    };

    if (isNotTextPoint(endPoint)) {
      return this;
    }

    var startPoint = dom.prevPointUntil(endPoint, isNotTextPoint);

    if (findAfter) {
      endPoint = dom.nextPointUntil(endPoint, isNotTextPoint);
    }

    return new range_WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
  }

  /**
   * returns range for words before cursor that match with a Regex
   *
   * example:
   *  range: 'hi @Peter Pan'
   *  regex: '/@[a-z ]+/i'
   *  return range: '@Peter Pan'
   *
   * @param {RegExp} [regex]
   * @return {WrappedRange|null}
   */
  getWordsMatchRange(regex) {
    var endPoint = this.getEndPoint();
    var startPoint = dom.prevPointUntil(endPoint, function (point) {
      if (!dom.isCharPoint(point) && !dom.isSpacePoint(point)) {
        return true;
      }

      var rng = new range_WrappedRange(point.node, point.offset, endPoint.node, endPoint.offset);
      var result = regex.exec(rng.toString());
      return result && result.index === 0;
    });
    var rng = new range_WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    var text = rng.toString();
    var result = regex.exec(text);

    if (result && result[0].length === text.length) {
      return rng;
    } else {
      return null;
    }
  }

  /**
   * create offsetPath bookmark
   *
   * @param {Node} editable
   */
  bookmark(editable) {
    return {
      s: {
        path: dom.makeOffsetPath(editable, this.sc),
        offset: this.so
      },
      e: {
        path: dom.makeOffsetPath(editable, this.ec),
        offset: this.eo
      }
    };
  }
  /**
   * create offsetPath bookmark base on paragraph
   *
   * @param {Node[]} paras
   */


  paraBookmark(paras) {
    return {
      s: {
        path: lists.tail(dom.makeOffsetPath(lists.head(paras), this.sc)),
        offset: this.so
      },
      e: {
        path: lists.tail(dom.makeOffsetPath(lists.last(paras), this.ec)),
        offset: this.eo
      }
    };
  }
  /**
   * getClientRects
   * @return {Rect[]}
   */


  getClientRects() {
    const nativeRng = this.nativeRange();
    return nativeRng.getClientRects();
  }

}
/**
 * Data structure
 *  * BoundaryPoint: a point of dom tree
 *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
 *
 * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
 */


/* harmony default export */ var core_range = ({
  /**
   * create Range Object From arguments or Browser Selection
   *
   * @param {Node} sc - start container
   * @param {Number} so - start offset
   * @param {Node} ec - end container
   * @param {Number} eo - end offset
   * @return {WrappedRange}
   */
  create: function (sc, so, ec, eo) {
    if (arguments.length === 4) {
      return new range_WrappedRange(sc, so, ec, eo);
    } else if (arguments.length === 2) {
      // collapsed
      ec = sc;
      eo = so;
      return new range_WrappedRange(sc, so, ec, eo);
    } else {
      let wrappedRange = this.createFromSelection();

      if (!wrappedRange && arguments.length === 1) {
        let bodyElement = arguments[0];

        if (dom.isEditable(bodyElement)) {
          bodyElement = bodyElement.lastChild;
        }

        return this.createFromBodyElement(bodyElement, dom.emptyPara === arguments[0].innerHTML);
      }

      return wrappedRange;
    }
  },
  createFromBodyElement: function (bodyElement, isCollapseToStart = false) {
    var wrappedRange = this.createFromNode(bodyElement);
    return wrappedRange.collapse(isCollapseToStart);
  },
  createFromSelection: function () {
    let sc, so, ec, eo;

    if (env.isW3CRangeSupport) {
      const selection = document.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return null;
      } else if (dom.isBody(selection.anchorNode)) {
        // Firefox: returns entire body as range on initialization.
        // We won't never need it.
        return null;
      }

      const nativeRng = selection.getRangeAt(0);
      sc = nativeRng.startContainer;
      so = nativeRng.startOffset;
      ec = nativeRng.endContainer;
      eo = nativeRng.endOffset;
    } else {
      // IE8: TextRange
      const textRange = document.selection.createRange();
      const textRangeEnd = textRange.duplicate();
      textRangeEnd.collapse(false);
      const textRangeStart = textRange;
      textRangeStart.collapse(true);
      let startPoint = textRangeToPoint(textRangeStart, true);
      let endPoint = textRangeToPoint(textRangeEnd, false); // same visible point case: range was collapsed.

      if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) && dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) && endPoint.node.nextSibling === startPoint.node) {
        startPoint = endPoint;
      }

      sc = startPoint.cont;
      so = startPoint.offset;
      ec = endPoint.cont;
      eo = endPoint.offset;
    }

    return new range_WrappedRange(sc, so, ec, eo);
  },

  /**
   * @method
   *
   * create WrappedRange from node
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNode: function (node) {
    let sc = node;
    let so = 0;
    let ec = node;
    let eo = dom.nodeLength(ec); // browsers can't target a picture or void node

    if (dom.isVoid(sc)) {
      so = dom.listPrev(sc).length - 1;
      sc = sc.parentNode;
    }

    if (dom.isBR(ec)) {
      eo = dom.listPrev(ec).length - 1;
      ec = ec.parentNode;
    } else if (dom.isVoid(ec)) {
      eo = dom.listPrev(ec).length;
      ec = ec.parentNode;
    }

    return this.create(sc, so, ec, eo);
  },

  /**
   * create WrappedRange from node after position
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNodeBefore: function (node) {
    return this.createFromNode(node).collapse(true);
  },

  /**
   * create WrappedRange from node after position
   *
   * @param {Node} node
   * @return {WrappedRange}
   */
  createFromNodeAfter: function (node) {
    return this.createFromNode(node).collapse();
  },

  /**
   * @method
   *
   * create WrappedRange from bookmark
   *
   * @param {Node} editable
   * @param {Object} bookmark
   * @return {WrappedRange}
   */
  createFromBookmark: function (editable, bookmark) {
    const sc = dom.fromOffsetPath(editable, bookmark.s.path);
    const so = bookmark.s.offset;
    const ec = dom.fromOffsetPath(editable, bookmark.e.path);
    const eo = bookmark.e.offset;
    return new range_WrappedRange(sc, so, ec, eo);
  },

  /**
   * @method
   *
   * create WrappedRange from paraBookmark
   *
   * @param {Object} bookmark
   * @param {Node[]} paras
   * @return {WrappedRange}
   */
  createFromParaBookmark: function (bookmark, paras) {
    const so = bookmark.s.offset;
    const eo = bookmark.e.offset;
    const sc = dom.fromOffsetPath(lists.head(paras), bookmark.s.path);
    const ec = dom.fromOffsetPath(lists.last(paras), bookmark.e.path);
    return new range_WrappedRange(sc, so, ec, eo);
  }
});
// CONCATENATED MODULE: ./src/js/base/core/key.js


const KEY_MAP = {
  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'SPACE': 32,
  'DELETE': 46,
  // Arrow
  'LEFT': 37,
  'UP': 38,
  'RIGHT': 39,
  'DOWN': 40,
  // Number: 0-9
  'NUM0': 48,
  'NUM1': 49,
  'NUM2': 50,
  'NUM3': 51,
  'NUM4': 52,
  'NUM5': 53,
  'NUM6': 54,
  'NUM7': 55,
  'NUM8': 56,
  // Alphabet: a-z
  'B': 66,
  'E': 69,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'R': 82,
  'S': 83,
  'U': 85,
  'V': 86,
  'Y': 89,
  'Z': 90,
  'SLASH': 191,
  'LEFTBRACKET': 219,
  'BACKSLASH': 220,
  'RIGHTBRACKET': 221,
  // Navigation
  'HOME': 36,
  'END': 35,
  'PAGEUP': 33,
  'PAGEDOWN': 34
};
/**
 * @class core.key
 *
 * Object for keycodes.
 *
 * @singleton
 * @alternateClassName key
 */

/* harmony default export */ var core_key = ({
  /**
   * @method isEdit
   *
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isEdit: keyCode => {
    return lists.contains([KEY_MAP.BACKSPACE, KEY_MAP.TAB, KEY_MAP.ENTER, KEY_MAP.SPACE, KEY_MAP.DELETE], keyCode);
  },

  /**
   * @method isMove
   *
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isMove: keyCode => {
    return lists.contains([KEY_MAP.LEFT, KEY_MAP.UP, KEY_MAP.RIGHT, KEY_MAP.DOWN], keyCode);
  },

  /**
   * @method isNavigation
   *
   * @param {Number} keyCode
   * @return {Boolean}
   */
  isNavigation: keyCode => {
    return lists.contains([KEY_MAP.HOME, KEY_MAP.END, KEY_MAP.PAGEUP, KEY_MAP.PAGEDOWN], keyCode);
  },

  /**
   * @property {Object} nameFromCode
   * @property {String} nameFromCode.8 "BACKSPACE"
   */
  nameFromCode: func.invertObject(KEY_MAP),
  code: KEY_MAP
});
// CONCATENATED MODULE: ./src/js/base/core/async.js

/**
 * @method readFileAsDataURL
 *
 * read contents of file as representing URL
 *
 * @param {File} file
 * @return {Promise} - then: dataUrl
 */

function readFileAsDataURL(file) {
  return external_jQuery_default.a.Deferred(deferred => {
    external_jQuery_default.a.extend(new FileReader(), {
      onload: e => {
        const dataURL = e.target.result;
        deferred.resolve(dataURL);
      },
      onerror: err => {
        deferred.reject(err);
      }
    }).readAsDataURL(file);
  }).promise();
}
/**
 * @method createImage
 *
 * create `<image>` from url string
 *
 * @param {String} url
 * @return {Promise} - then: $image
 */

function createImage(url) {
  return external_jQuery_default.a.Deferred(deferred => {
    const $img = external_jQuery_default()('<img>');
    $img.one('load', () => {
      $img.off('error abort');
      deferred.resolve($img);
    }).one('error abort', () => {
      $img.off('load').detach();
      deferred.reject($img);
    }).css({
      display: 'none'
    }).appendTo(document.body).attr('src', url);
  }).promise();
}
// CONCATENATED MODULE: ./src/js/base/editing/History.js

class History_History {
  constructor($editable) {
    this.stack = [];
    this.stackOffset = -1;
    this.$editable = $editable;
    this.editable = $editable[0];
  }

  makeSnapshot() {
    const rng = core_range.create(this.editable);
    const emptyBookmark = {
      s: {
        path: [],
        offset: 0
      },
      e: {
        path: [],
        offset: 0
      }
    };
    return {
      contents: this.$editable.html(),
      bookmark: rng && rng.isOnEditable() ? rng.bookmark(this.editable) : emptyBookmark
    };
  }

  applySnapshot(snapshot) {
    if (snapshot.contents !== null) {
      this.$editable.html(snapshot.contents);
    }

    if (snapshot.bookmark !== null) {
      core_range.createFromBookmark(this.editable, snapshot.bookmark).select();
    }
  }
  /**
  * @method rewind
  * Rewinds the history stack back to the first snapshot taken.
  * Leaves the stack intact, so that "Redo" can still be used.
  */


  rewind() {
    // Create snap shot if not yet recorded
    if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
      this.recordUndo();
    } // Return to the first available snapshot.


    this.stackOffset = 0; // Apply that snapshot.

    this.applySnapshot(this.stack[this.stackOffset]);
  }
  /**
  *  @method commit
  *  Resets history stack, but keeps current editor's content.
  */


  commit() {
    // Clear the stack.
    this.stack = []; // Restore stackOffset to its original value.

    this.stackOffset = -1; // Record our first snapshot (of nothing).

    this.recordUndo();
  }
  /**
  * @method reset
  * Resets the history stack completely; reverting to an empty editor.
  */


  reset() {
    // Clear the stack.
    this.stack = []; // Restore stackOffset to its original value.

    this.stackOffset = -1; // Clear the editable area.

    this.$editable.html(''); // Record our first snapshot (of nothing).

    this.recordUndo();
  }
  /**
   * undo
   */


  undo() {
    // Create snap shot if not yet recorded
    if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
      this.recordUndo();
    }

    if (this.stackOffset > 0) {
      this.stackOffset--;
      this.applySnapshot(this.stack[this.stackOffset]);
    }
  }
  /**
   * redo
   */


  redo() {
    if (this.stack.length - 1 > this.stackOffset) {
      this.stackOffset++;
      this.applySnapshot(this.stack[this.stackOffset]);
    }
  }
  /**
   * recorded undo
   */


  recordUndo() {
    this.stackOffset++; // Wash out stack after stackOffset

    if (this.stack.length > this.stackOffset) {
      this.stack = this.stack.slice(0, this.stackOffset);
    } // Create new snapshot and push it to the end


    this.stack.push(this.makeSnapshot());
  }

}
// CONCATENATED MODULE: ./src/js/base/editing/Style.js





class Style_Style {
  /**
   * @method jQueryCSS
   *
   * [workaround] for old jQuery
   * passing an array of style properties to .css()
   * will result in an object of property-value pairs.
   * (compability with version < 1.9)
   *
   * @private
   * @param  {jQuery} $obj
   * @param  {Array} propertyNames - An array of one or more CSS properties.
   * @return {Object}
   */
  jQueryCSS($obj, propertyNames) {
    if (env.jqueryVersion < 1.9) {
      const result = {};
      external_jQuery_default.a.each(propertyNames, (idx, propertyName) => {
        result[propertyName] = $obj.css(propertyName);
      });
      return result;
    }

    return $obj.css(propertyNames);
  }
  /**
   * returns style object from node
   *
   * @param {jQuery} $node
   * @return {Object}
   */


  fromNode($node) {
    const properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
    const styleInfo = this.jQueryCSS($node, properties) || {};
    const fontSize = $node[0].style.fontSize || styleInfo['font-size'];
    styleInfo['font-size'] = parseInt(fontSize, 10);
    styleInfo['font-size-unit'] = fontSize.match(/[a-z%]+$/);
    return styleInfo;
  }
  /**
   * paragraph level style
   *
   * @param {WrappedRange} rng
   * @param {Object} styleInfo
   */


  stylePara(rng, styleInfo) {
    external_jQuery_default.a.each(rng.nodes(dom.isPara, {
      includeAncestor: true
    }), (idx, para) => {
      external_jQuery_default()(para).css(styleInfo);
    });
  }
  /**
   * insert and returns styleNodes on range.
   *
   * @param {WrappedRange} rng
   * @param {Object} [options] - options for styleNodes
   * @param {String} [options.nodeName] - default: `SPAN`
   * @param {Boolean} [options.expandClosestSibling] - default: `false`
   * @param {Boolean} [options.onlyPartialContains] - default: `false`
   * @return {Node[]}
   */


  styleNodes(rng, options) {
    rng = rng.splitText();
    const nodeName = options && options.nodeName || 'SPAN';
    const expandClosestSibling = !!(options && options.expandClosestSibling);
    const onlyPartialContains = !!(options && options.onlyPartialContains);

    if (rng.isCollapsed()) {
      return [rng.insertNode(dom.create(nodeName))];
    }

    let pred = dom.makePredByNodeName(nodeName);
    const nodes = rng.nodes(dom.isText, {
      fullyContains: true
    }).map(text => {
      return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
    });

    if (expandClosestSibling) {
      if (onlyPartialContains) {
        const nodesInRange = rng.nodes(); // compose with partial contains predication

        pred = func.and(pred, node => {
          return lists.contains(nodesInRange, node);
        });
      }

      return nodes.map(node => {
        const siblings = dom.withClosestSiblings(node, pred);
        const head = lists.head(siblings);
        const tails = lists.tail(siblings);
        external_jQuery_default.a.each(tails, (idx, elem) => {
          dom.appendChildNodes(head, elem.childNodes);
          dom.remove(elem);
        });
        return lists.head(siblings);
      });
    } else {
      return nodes;
    }
  }
  /**
   * get current style on cursor
   *
   * @param {WrappedRange} rng
   * @return {Object} - object contains style properties.
   */


  current(rng) {
    const $cont = external_jQuery_default()(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
    let styleInfo = this.fromNode($cont); // document.queryCommandState for toggle state
    // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"

    try {
      styleInfo = external_jQuery_default.a.extend(styleInfo, {
        'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
        'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
        'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
        'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
        'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
        'font-strikethrough': document.queryCommandState('strikethrough') ? 'strikethrough' : 'normal',
        'font-family': document.queryCommandValue('fontname') || styleInfo['font-family']
      });
    } catch (e) {} // list-style-type to list-style(unordered, ordered)


    if (!rng.isOnList()) {
      styleInfo['list-style'] = 'none';
    } else {
      const orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
      const isUnordered = orderedTypes.indexOf(styleInfo['list-style-type']) > -1;
      styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
    }

    const para = dom.ancestor(rng.sc, dom.isPara);

    if (para && para.style['line-height']) {
      styleInfo['line-height'] = para.style.lineHeight;
    } else {
      const lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
      styleInfo['line-height'] = lineHeight.toFixed(1);
    }

    styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
    styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
    styleInfo.range = rng;
    return styleInfo;
  }

}
// CONCATENATED MODULE: ./src/js/base/editing/Bullet.js





class Bullet_Bullet {
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
    const rng = core_range.create(editable).wrapBodyInlineWithPara();
    const paras = rng.nodes(dom.isPara, {
      includeAncestor: true
    });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
    external_jQuery_default.a.each(clustereds, (idx, paras) => {
      const head = lists.head(paras);

      if (dom.isLi(head)) {
        const previousList = this.findList(head.previousSibling);

        if (previousList) {
          paras.map(para => previousList.appendChild(para));
        } else {
          this.wrapList(paras, head.parentNode.nodeName);
          paras.map(para => para.parentNode).map(para => this.appendToPrevious(para));
        }
      } else {
        external_jQuery_default.a.each(paras, (idx, para) => {
          external_jQuery_default()(para).css('marginLeft', (idx, val) => {
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
    const rng = core_range.create(editable).wrapBodyInlineWithPara();
    const paras = rng.nodes(dom.isPara, {
      includeAncestor: true
    });
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
    external_jQuery_default.a.each(clustereds, (idx, paras) => {
      const head = lists.head(paras);

      if (dom.isLi(head)) {
        this.releaseList([paras]);
      } else {
        external_jQuery_default.a.each(paras, (idx, para) => {
          external_jQuery_default()(para).css('marginLeft', (idx, val) => {
            val = parseInt(val, 10) || 0;
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
    const rng = core_range.create(editable).wrapBodyInlineWithPara();
    let paras = rng.nodes(dom.isPara, {
      includeAncestor: true
    });
    const bookmark = rng.paraBookmark(paras);
    const clustereds = lists.clusterBy(paras, func.peq2('parentNode')); // paragraph to list

    if (lists.find(paras, dom.isPurePara)) {
      let wrappedParas = [];
      external_jQuery_default.a.each(clustereds, (idx, paras) => {
        wrappedParas = wrappedParas.concat(this.wrapList(paras, listName));
      });
      paras = wrappedParas; // list to paragraph or change list style
    } else {
      const diffLists = rng.nodes(dom.isList, {
        includeAncestor: true
      }).filter(listNode => {
        return !external_jQuery_default.a.nodeName(listNode, listName);
      });

      if (diffLists.length) {
        external_jQuery_default.a.each(diffLists, (idx, listNode) => {
          dom.replace(listNode, listName);
        });
      } else {
        paras = this.releaseList(clustereds, true);
      }
    }

    core_range.createFromParaBookmark(bookmark, paras).select();
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
    const listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last); // P to LI

    paras = paras.map(para => {
      return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
    }); // append to list(<ul>, <ol>)

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
    external_jQuery_default.a.each(clustereds, (idx, paras) => {
      const head = lists.head(paras);
      const last = lists.last(paras);
      const headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
      const parentItem = headList.parentNode;

      if (headList.parentNode.nodeName === 'LI') {
        paras.map(para => {
          const newList = this.findNextSiblings(para);

          if (parentItem.nextSibling) {
            parentItem.parentNode.insertBefore(para, parentItem.nextSibling);
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
        paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) : lists.from(middleList.childNodes).filter(dom.isLi); // LI to P

        if (isEscapseToBody || !dom.isList(headList.parentNode)) {
          paras = paras.map(para => {
            return dom.replace(para, 'P');
          });
        }

        external_jQuery_default.a.each(lists.from(paras).reverse(), (idx, para) => {
          dom.insertAfter(para, headList);
        }); // remove empty lists

        const rootLists = lists.compact([headList, middleList, lastList]);
        external_jQuery_default.a.each(rootLists, (idx, rootList) => {
          const listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
          external_jQuery_default.a.each(listNodes.reverse(), (idx, listNode) => {
            if (!dom.nodeLength(listNode)) {
              dom.remove(listNode, true);
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
    return node.previousSibling ? dom.appendChildNodes(node.previousSibling, [node]) : this.wrapList([node], 'LI');
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
    return node ? lists.find(node.children, child => ['OL', 'UL'].indexOf(child.nodeName) > -1) : null;
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
// CONCATENATED MODULE: ./src/js/base/editing/Typing.js




/**
 * @class editing.Typing
 *
 * Typing
 *
 */

class Typing_Typing {
  constructor(context) {
    // a Bullet instance to toggle lists off
    this.bullet = new Bullet_Bullet();
    this.options = context.options;
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
    rng = core_range.create(tab, tabsize);
    rng.select();
  }
  /**
   * insert paragraph
   *
   * @param {jQuery} $editable
   * @param {WrappedRange} rng Can be used in unit tests to "mock" the range
   *
   * blockquoteBreakingLevel
   *   0 - No break, the new paragraph remains inside the quote
   *   1 - Break the first blockquote in the ancestors list
   *   2 - Break all blockquotes, so that the new paragraph is not quoted (this is the default)
   */


  insertParagraph(editable, rng) {
    rng = rng || core_range.create(editable); // deleteContents on range.

    rng = rng.deleteContents(); // Wrap range if it needs to be wrapped by paragraph

    rng = rng.wrapBodyInlineWithPara(); // finding paragraph

    const splitRoot = dom.ancestor(rng.sc, dom.isPara);
    let nextPara; // on paragraph: split paragraph

    if (splitRoot) {
      // if it is an empty line with li
      if (dom.isLi(splitRoot) && (dom.isEmpty(splitRoot) || dom.deepestChildIsEmpty(splitRoot))) {
        // toogle UL/OL and escape
        this.bullet.toggleList(splitRoot.parentNode.nodeName);
        return;
      } else {
        let blockquote = null;

        if (this.options.blockquoteBreakingLevel === 1) {
          blockquote = dom.ancestor(splitRoot, dom.isBlockquote);
        } else if (this.options.blockquoteBreakingLevel === 2) {
          blockquote = dom.lastAncestor(splitRoot, dom.isBlockquote);
        }

        if (blockquote) {
          // We're inside a blockquote and options ask us to break it
          nextPara = external_jQuery_default()(dom.emptyPara)[0]; // If the split is right before a <br>, remove it so that there's no "empty line"
          // after the split in the new blockquote created

          if (dom.isRightEdgePoint(rng.getStartPoint()) && dom.isBR(rng.sc.nextSibling)) {
            external_jQuery_default()(rng.sc.nextSibling).remove();
          }

          const split = dom.splitTree(blockquote, rng.getStartPoint(), {
            isDiscardEmptySplits: true
          });

          if (split) {
            split.parentNode.insertBefore(nextPara, split);
          } else {
            dom.insertAfter(nextPara, blockquote); // There's no split if we were at the end of the blockquote
          }
        } else {
          nextPara = dom.splitTree(splitRoot, rng.getStartPoint()); // not a blockquote, just insert the paragraph

          let emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
          emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
          external_jQuery_default.a.each(emptyAnchors, (idx, anchor) => {
            dom.remove(anchor);
          }); // replace empty heading, pre or custom-made styleTag with P tag

          if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) {
            nextPara = dom.replace(nextPara, 'p');
          }
        }
      } // no paragraph: insert empty paragraph

    } else {
      const next = rng.sc.childNodes[rng.so];
      nextPara = external_jQuery_default()(dom.emptyPara)[0];

      if (next) {
        rng.sc.insertBefore(nextPara, next);
      } else {
        rng.sc.appendChild(nextPara);
      }
    }

    core_range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
  }

}
// CONCATENATED MODULE: ./src/js/base/editing/Table.js




/**
 * @class Create a virtual table to create what actions to do in change.
 * @param {object} startPoint Cell selected to apply change.
 * @param {enum} where  Where change will be applied Row or Col. Use enum: TableResultAction.where
 * @param {enum} action Action to be applied. Use enum: TableResultAction.requestAction
 * @param {object} domTable Dom element of table to make changes.
 */

const TableResultAction = function (startPoint, where, action, domTable) {
  const _startPoint = {
    'colPos': 0,
    'rowPos': 0
  };
  const _virtualTable = [];
  const _actionCellList = []; /// ///////////////////////////////////////////
  // Private functions
  /// ///////////////////////////////////////////

  /**
   * Set the startPoint of action.
   */

  function setStartPoint() {
    if (!startPoint || !startPoint.tagName || startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th') {
      console.error('Impossible to identify start Cell point.', startPoint);
      return;
    }

    _startPoint.colPos = startPoint.cellIndex;

    if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
      console.error('Impossible to identify start Row point.', startPoint);
      return;
    }

    _startPoint.rowPos = startPoint.parentElement.rowIndex;
  }
  /**
   * Define virtual table position info object.
   *
   * @param {int} rowIndex Index position in line of virtual table.
   * @param {int} cellIndex Index position in column of virtual table.
   * @param {object} baseRow Row affected by this position.
   * @param {object} baseCell Cell affected by this position.
   * @param {bool} isSpan Inform if it is an span cell/row.
   */


  function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
    const objPosition = {
      'baseRow': baseRow,
      'baseCell': baseCell,
      'isRowSpan': isRowSpan,
      'isColSpan': isColSpan,
      'isVirtual': isVirtualCell
    };

    if (!_virtualTable[rowIndex]) {
      _virtualTable[rowIndex] = [];
    }

    _virtualTable[rowIndex][cellIndex] = objPosition;
  }
  /**
   * Create action cell object.
   *
   * @param {object} virtualTableCellObj Object of specific position on virtual table.
   * @param {enum} resultAction Action to be applied in that item.
   */


  function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
    return {
      'baseCell': virtualTableCellObj.baseCell,
      'action': resultAction,
      'virtualTable': {
        'rowIndex': virtualRowPosition,
        'cellIndex': virtualColPosition
      }
    };
  }
  /**
   * Recover free index of row to append Cell.
   *
   * @param {int} rowIndex Index of row to find free space.
   * @param {int} cellIndex Index of cell to find free space in table.
   */


  function recoverCellIndex(rowIndex, cellIndex) {
    if (!_virtualTable[rowIndex]) {
      return cellIndex;
    }

    if (!_virtualTable[rowIndex][cellIndex]) {
      return cellIndex;
    }

    let newCellIndex = cellIndex;

    while (_virtualTable[rowIndex][newCellIndex]) {
      newCellIndex++;

      if (!_virtualTable[rowIndex][newCellIndex]) {
        return newCellIndex;
      }
    }
  }
  /**
   * Recover info about row and cell and add information to virtual table.
   *
   * @param {object} row Row to recover information.
   * @param {object} cell Cell to recover information.
   */


  function addCellInfoToVirtual(row, cell) {
    const cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
    const cellHasColspan = cell.colSpan > 1;
    const cellHasRowspan = cell.rowSpan > 1;
    const isThisSelectedCell = row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos;
    setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false); // Add span rows to virtual Table.

    const rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;

    if (rowspanNumber > 1) {
      for (let rp = 1; rp < rowspanNumber; rp++) {
        const rowspanIndex = row.rowIndex + rp;
        adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
        setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
      }
    } // Add span cols to virtual table.


    const colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;

    if (colspanNumber > 1) {
      for (let cp = 1; cp < colspanNumber; cp++) {
        const cellspanIndex = recoverCellIndex(row.rowIndex, cellIndex + cp);
        adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
        setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
      }
    }
  }
  /**
   * Process validation and adjust of start point if needed
   *
   * @param {int} rowIndex
   * @param {int} cellIndex
   * @param {object} cell
   * @param {bool} isSelectedCell
   */


  function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
    if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
      _startPoint.colPos++;
    }
  }
  /**
   * Create virtual table of cells with all cells, including span cells.
   */


  function createVirtualTable() {
    const rows = domTable.rows;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].cells;

      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
      }
    }
  }
  /**
   * Get action to be applied on the cell.
   *
   * @param {object} cell virtual table cell to apply action
   */


  function getDeleteResultActionToCell(cell) {
    switch (where) {
      case TableResultAction.where.Column:
        if (cell.isColSpan) {
          return TableResultAction.resultAction.SubtractSpanCount;
        }

        break;

      case TableResultAction.where.Row:
        if (!cell.isVirtual && cell.isRowSpan) {
          return TableResultAction.resultAction.AddCell;
        } else if (cell.isRowSpan) {
          return TableResultAction.resultAction.SubtractSpanCount;
        }

        break;
    }

    return TableResultAction.resultAction.RemoveCell;
  }
  /**
   * Get action to be applied on the cell.
   *
   * @param {object} cell virtual table cell to apply action
   */


  function getAddResultActionToCell(cell) {
    switch (where) {
      case TableResultAction.where.Column:
        if (cell.isColSpan) {
          return TableResultAction.resultAction.SumSpanCount;
        } else if (cell.isRowSpan && cell.isVirtual) {
          return TableResultAction.resultAction.Ignore;
        }

        break;

      case TableResultAction.where.Row:
        if (cell.isRowSpan) {
          return TableResultAction.resultAction.SumSpanCount;
        } else if (cell.isColSpan && cell.isVirtual) {
          return TableResultAction.resultAction.Ignore;
        }

        break;
    }

    return TableResultAction.resultAction.AddCell;
  }

  function init() {
    setStartPoint();
    createVirtualTable();
  } /// ///////////////////////////////////////////
  // Public functions
  /// ///////////////////////////////////////////

  /**
   * Recover array os what to do in table.
   */


  this.getActionList = function () {
    const fixedRow = where === TableResultAction.where.Row ? _startPoint.rowPos : -1;
    const fixedCol = where === TableResultAction.where.Column ? _startPoint.colPos : -1;
    let actualPosition = 0;
    let canContinue = true;

    while (canContinue) {
      const rowPosition = fixedRow >= 0 ? fixedRow : actualPosition;
      const colPosition = fixedCol >= 0 ? fixedCol : actualPosition;
      const row = _virtualTable[rowPosition];

      if (!row) {
        canContinue = false;
        return _actionCellList;
      }

      const cell = row[colPosition];

      if (!cell) {
        canContinue = false;
        return _actionCellList;
      } // Define action to be applied in this cell


      let resultAction = TableResultAction.resultAction.Ignore;

      switch (action) {
        case TableResultAction.requestAction.Add:
          resultAction = getAddResultActionToCell(cell);
          break;

        case TableResultAction.requestAction.Delete:
          resultAction = getDeleteResultActionToCell(cell);
          break;
      }

      _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));

      actualPosition++;
    }

    return _actionCellList;
  };

  init();
};
/**
*
* Where action occours enum.
*/


TableResultAction.where = {
  'Row': 0,
  'Column': 1
};
/**
*
* Requested action to apply enum.
*/

TableResultAction.requestAction = {
  'Add': 0,
  'Delete': 1
};
/**
*
* Result action to be executed enum.
*/

TableResultAction.resultAction = {
  'Ignore': 0,
  'SubtractSpanCount': 1,
  'RemoveCell': 2,
  'AddCell': 3,
  'SumSpanCount': 4
};
/**
 *
 * @class editing.Table
 *
 * Table
 *
 */

class Table_Table {
  /**
   * handle tab key
   *
   * @param {WrappedRange} rng
   * @param {Boolean} isShift
   */
  tab(rng, isShift) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    const table = dom.ancestor(cell, dom.isTable);
    const cells = dom.listDescendant(table, dom.isCell);
    const nextCell = lists[isShift ? 'prev' : 'next'](cells, cell);

    if (nextCell) {
      core_range.create(nextCell, 0).select();
    }
  }
  /**
   * Add a new row
   *
   * @param {WrappedRange} rng
   * @param {String} position (top/bottom)
   * @return {Node}
   */


  addRow(rng, position) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    const currentTr = external_jQuery_default()(cell).closest('tr');
    const trAttributes = this.recoverAttributes(currentTr);
    const html = external_jQuery_default()('<tr' + trAttributes + '></tr>');
    const vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Add, external_jQuery_default()(currentTr).closest('table')[0]);
    const actions = vTable.getActionList();

    for (let idCell = 0; idCell < actions.length; idCell++) {
      const currentCell = actions[idCell];
      const tdAttributes = this.recoverAttributes(currentCell.baseCell);

      switch (currentCell.action) {
        case TableResultAction.resultAction.AddCell:
          html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
          break;

        case TableResultAction.resultAction.SumSpanCount:
          if (position === 'top') {
            const baseCellTr = currentCell.baseCell.parent;
            const isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;

            if (isTopFromRowSpan) {
              const newTd = external_jQuery_default()('<div></div>').append(external_jQuery_default()('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
              html.append(newTd);
              break;
            }
          }

          let rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
          rowspanNumber++;
          currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
          break;
      }
    }

    if (position === 'top') {
      currentTr.before(html);
    } else {
      const cellHasRowspan = cell.rowSpan > 1;

      if (cellHasRowspan) {
        const lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
        external_jQuery_default()(external_jQuery_default()(currentTr).parent().find('tr')[lastTrIndex]).after(external_jQuery_default()(html));
        return;
      }

      currentTr.after(html);
    }
  }
  /**
   * Add a new col
   *
   * @param {WrappedRange} rng
   * @param {String} position (left/right)
   * @return {Node}
   */


  addCol(rng, position) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    const row = external_jQuery_default()(cell).closest('tr');
    const rowsGroup = external_jQuery_default()(row).siblings();
    rowsGroup.push(row);
    const vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Add, external_jQuery_default()(row).closest('table')[0]);
    const actions = vTable.getActionList();

    for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      const currentCell = actions[actionIndex];
      const tdAttributes = this.recoverAttributes(currentCell.baseCell);

      switch (currentCell.action) {
        case TableResultAction.resultAction.AddCell:
          if (position === 'right') {
            external_jQuery_default()(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
          } else {
            external_jQuery_default()(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
          }

          break;

        case TableResultAction.resultAction.SumSpanCount:
          if (position === 'right') {
            let colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
            colspanNumber++;
            currentCell.baseCell.setAttribute('colSpan', colspanNumber);
          } else {
            external_jQuery_default()(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
          }

          break;
      }
    }
  }
  /*
  * Copy attributes from element.
  *
  * @param {object} Element to recover attributes.
  * @return {string} Copied string elements.
  */


  recoverAttributes(el) {
    let resultStr = '';

    if (!el) {
      return resultStr;
    }

    const attrList = el.attributes || [];

    for (let i = 0; i < attrList.length; i++) {
      if (attrList[i].name.toLowerCase() === 'id') {
        continue;
      }

      if (attrList[i].specified) {
        resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
      }
    }

    return resultStr;
  }
  /**
   * Delete current row
   *
   * @param {WrappedRange} rng
   * @return {Node}
   */


  deleteRow(rng) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    const row = external_jQuery_default()(cell).closest('tr');
    const cellPos = row.children('td, th').index(external_jQuery_default()(cell));
    const rowPos = row[0].rowIndex;
    const vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Delete, external_jQuery_default()(row).closest('table')[0]);
    const actions = vTable.getActionList();

    for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      if (!actions[actionIndex]) {
        continue;
      }

      const baseCell = actions[actionIndex].baseCell;
      const virtualPosition = actions[actionIndex].virtualTable;
      const hasRowspan = baseCell.rowSpan && baseCell.rowSpan > 1;
      let rowspanNumber = hasRowspan ? parseInt(baseCell.rowSpan, 10) : 0;

      switch (actions[actionIndex].action) {
        case TableResultAction.resultAction.Ignore:
          continue;

        case TableResultAction.resultAction.AddCell:
          const nextRow = row.next('tr')[0];

          if (!nextRow) {
            continue;
          }

          const cloneRow = row[0].cells[cellPos];

          if (hasRowspan) {
            if (rowspanNumber > 2) {
              rowspanNumber--;
              nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
              nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
              nextRow.cells[cellPos].innerHTML = '';
            } else if (rowspanNumber === 2) {
              nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
              nextRow.cells[cellPos].removeAttribute('rowSpan');
              nextRow.cells[cellPos].innerHTML = '';
            }
          }

          continue;

        case TableResultAction.resultAction.SubtractSpanCount:
          if (hasRowspan) {
            if (rowspanNumber > 2) {
              rowspanNumber--;
              baseCell.setAttribute('rowSpan', rowspanNumber);

              if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                baseCell.innerHTML = '';
              }
            } else if (rowspanNumber === 2) {
              baseCell.removeAttribute('rowSpan');

              if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                baseCell.innerHTML = '';
              }
            }
          }

          continue;

        case TableResultAction.resultAction.RemoveCell:
          // Do not need remove cell because row will be deleted.
          continue;
      }
    }

    row.remove();
  }
  /**
   * Delete current col
   *
   * @param {WrappedRange} rng
   * @return {Node}
   */


  deleteCol(rng) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    const row = external_jQuery_default()(cell).closest('tr');
    const cellPos = row.children('td, th').index(external_jQuery_default()(cell));
    const vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Delete, external_jQuery_default()(row).closest('table')[0]);
    const actions = vTable.getActionList();

    for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      if (!actions[actionIndex]) {
        continue;
      }

      switch (actions[actionIndex].action) {
        case TableResultAction.resultAction.Ignore:
          continue;

        case TableResultAction.resultAction.SubtractSpanCount:
          const baseCell = actions[actionIndex].baseCell;
          const hasColspan = baseCell.colSpan && baseCell.colSpan > 1;

          if (hasColspan) {
            let colspanNumber = baseCell.colSpan ? parseInt(baseCell.colSpan, 10) : 0;

            if (colspanNumber > 2) {
              colspanNumber--;
              baseCell.setAttribute('colSpan', colspanNumber);

              if (baseCell.cellIndex === cellPos) {
                baseCell.innerHTML = '';
              }
            } else if (colspanNumber === 2) {
              baseCell.removeAttribute('colSpan');

              if (baseCell.cellIndex === cellPos) {
                baseCell.innerHTML = '';
              }
            }
          }

          continue;

        case TableResultAction.resultAction.RemoveCell:
          dom.remove(actions[actionIndex].baseCell, true);
          continue;
      }
    }
  }
  /**
   * create empty table element
   *
   * @param {Number} rowCount
   * @param {Number} colCount
   * @return {Node}
   */


  createTable(colCount, rowCount, options) {
    const tds = [];
    let tdHTML;

    for (let idxCol = 0; idxCol < colCount; idxCol++) {
      tds.push('<td>' + dom.blank + '</td>');
    }

    tdHTML = tds.join('');
    const trs = [];
    let trHTML;

    for (let idxRow = 0; idxRow < rowCount; idxRow++) {
      trs.push('<tr>' + tdHTML + '</tr>');
    }

    trHTML = trs.join('');
    const $table = external_jQuery_default()('<table>' + trHTML + '</table>');

    if (options && options.tableClassName) {
      $table.addClass(options.tableClassName);
    }

    return $table[0];
  }
  /**
   * Delete current table
   *
   * @param {WrappedRange} rng
   * @return {Node}
   */


  deleteTable(rng) {
    const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
    external_jQuery_default()(cell).closest('table').remove();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Editor.js













const KEY_BOGUS = 'bogus';
/**
 * @class Editor
 */

class Editor_Editor {
  constructor(context) {
    this.context = context;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.editable = this.$editable[0];
    this.lastRange = null;
    this.snapshot = null;
    this.style = new Style_Style();
    this.table = new Table_Table();
    this.typing = new Typing_Typing(context);
    this.bullet = new Bullet_Bullet();
    this.history = new History_History(this.$editable);
    this.context.memo('help.undo', this.lang.help.undo);
    this.context.memo('help.redo', this.lang.help.redo);
    this.context.memo('help.tab', this.lang.help.tab);
    this.context.memo('help.untab', this.lang.help.untab);
    this.context.memo('help.insertParagraph', this.lang.help.insertParagraph);
    this.context.memo('help.insertOrderedList', this.lang.help.insertOrderedList);
    this.context.memo('help.insertUnorderedList', this.lang.help.insertUnorderedList);
    this.context.memo('help.indent', this.lang.help.indent);
    this.context.memo('help.outdent', this.lang.help.outdent);
    this.context.memo('help.formatPara', this.lang.help.formatPara);
    this.context.memo('help.insertHorizontalRule', this.lang.help.insertHorizontalRule);
    this.context.memo('help.fontName', this.lang.help.fontName); // native commands(with execCommand), generate function for execCommand

    const commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'formatBlock', 'removeFormat', 'backColor'];

    for (let idx = 0, len = commands.length; idx < len; idx++) {
      this[commands[idx]] = (sCmd => {
        return value => {
          this.beforeCommand();
          document.execCommand(sCmd, false, value);
          this.afterCommand(true);
        };
      })(commands[idx]);

      this.context.memo('help.' + commands[idx], this.lang.help[commands[idx]]);
    }

    this.fontName = this.wrapCommand(value => {
      return this.fontStyling('font-family', env.validFontName(value));
    });
    this.fontSize = this.wrapCommand(value => {
      const unit = this.currentStyle()['font-size-unit'];
      return this.fontStyling('font-size', value + unit);
    });
    this.fontSizeUnit = this.wrapCommand(value => {
      const size = this.currentStyle()['font-size'];
      return this.fontStyling('font-size', size + value);
    });

    for (let idx = 1; idx <= 6; idx++) {
      this['formatH' + idx] = (idx => {
        return () => {
          this.formatBlock('H' + idx);
        };
      })(idx);

      this.context.memo('help.formatH' + idx, this.lang.help['formatH' + idx]);
    }

    ;
    this.insertParagraph = this.wrapCommand(() => {
      this.typing.insertParagraph(this.editable);
    });
    this.insertOrderedList = this.wrapCommand(() => {
      this.bullet.insertOrderedList(this.editable);
    });
    this.insertUnorderedList = this.wrapCommand(() => {
      this.bullet.insertUnorderedList(this.editable);
    });
    this.indent = this.wrapCommand(() => {
      this.bullet.indent(this.editable);
    });
    this.outdent = this.wrapCommand(() => {
      this.bullet.outdent(this.editable);
    });
    /**
     * insertNode
     * insert node
     * @param {Node} node
     */

    this.insertNode = this.wrapCommand(node => {
      if (this.isLimited(external_jQuery_default()(node).text().length)) {
        return;
      }

      const rng = this.getLastRange();
      rng.insertNode(node);
      this.setLastRange(core_range.createFromNodeAfter(node).select());
    });
    /**
     * insert text
     * @param {String} text
     */

    this.insertText = this.wrapCommand(text => {
      if (this.isLimited(text.length)) {
        return;
      }

      const rng = this.getLastRange();
      const textNode = rng.insertNode(dom.createText(text));
      this.setLastRange(core_range.create(textNode, dom.nodeLength(textNode)).select());
    });
    /**
     * paste HTML
     * @param {String} markup
     */

    this.pasteHTML = this.wrapCommand(markup => {
      if (this.isLimited(markup.length)) {
        return;
      }

      markup = this.context.invoke('codeview.purify', markup);
      const contents = this.getLastRange().pasteHTML(markup);
      this.setLastRange(core_range.createFromNodeAfter(lists.last(contents)).select());
    });
    /**
     * formatBlock
     *
     * @param {String} tagName
     */

    this.formatBlock = this.wrapCommand((tagName, $target) => {
      const onApplyCustomStyle = this.options.callbacks.onApplyCustomStyle;

      if (onApplyCustomStyle) {
        onApplyCustomStyle.call(this, $target, this.context, this.onFormatBlock);
      } else {
        this.onFormatBlock(tagName, $target);
      }
    });
    /**
     * insert horizontal rule
     */

    this.insertHorizontalRule = this.wrapCommand(() => {
      const hrNode = this.getLastRange().insertNode(dom.create('HR'));

      if (hrNode.nextSibling) {
        this.setLastRange(core_range.create(hrNode.nextSibling, 0).normalize().select());
      }
    });
    /**
     * lineHeight
     * @param {String} value
     */

    this.lineHeight = this.wrapCommand(value => {
      this.style.stylePara(this.getLastRange(), {
        lineHeight: value
      });
    });
    /**
     * create link (command)
     *
     * @param {Object} linkInfo
     */

    this.createLink = this.wrapCommand(linkInfo => {
      let linkUrl = linkInfo.url;
      const linkText = linkInfo.text;
      const isNewWindow = linkInfo.isNewWindow;
      const checkProtocol = linkInfo.checkProtocol;
      let rng = linkInfo.range || this.getLastRange();
      const additionalTextLength = linkText.length - rng.toString().length;

      if (additionalTextLength > 0 && this.isLimited(additionalTextLength)) {
        return;
      }

      const isTextChanged = rng.toString() !== linkText; // handle spaced urls from input

      if (typeof linkUrl === 'string') {
        linkUrl = linkUrl.trim();
      }

      if (this.options.onCreateLink) {
        linkUrl = this.options.onCreateLink(linkUrl);
      } else if (checkProtocol) {
        // if url doesn't have any protocol and not even a relative or a label, use http:// as default
        linkUrl = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkUrl) ? linkUrl : this.options.defaultProtocol + linkUrl;
      }

      let anchors = [];

      if (isTextChanged) {
        rng = rng.deleteContents();
        const anchor = rng.insertNode(external_jQuery_default()('<A>' + linkText + '</A>')[0]);
        anchors.push(anchor);
      } else {
        anchors = this.style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true
        });
      }

      external_jQuery_default.a.each(anchors, (idx, anchor) => {
        external_jQuery_default()(anchor).attr('href', linkUrl);

        if (isNewWindow) {
          external_jQuery_default()(anchor).attr('target', '_blank');
        } else {
          external_jQuery_default()(anchor).removeAttr('target');
        }
      });
      const startRange = core_range.createFromNodeBefore(lists.head(anchors));
      const startPoint = startRange.getStartPoint();
      const endRange = core_range.createFromNodeAfter(lists.last(anchors));
      const endPoint = endRange.getEndPoint();
      this.setLastRange(core_range.create(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset).select());
    });
    /**
     * setting color
     *
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */

    this.color = this.wrapCommand(colorInfo => {
      const foreColor = colorInfo.foreColor;
      const backColor = colorInfo.backColor;

      if (foreColor) {
        document.execCommand('foreColor', false, foreColor);
      }

      if (backColor) {
        document.execCommand('backColor', false, backColor);
      }
    });
    /**
     * Set foreground color
     *
     * @param {String} colorCode foreground color code
     */

    this.foreColor = this.wrapCommand(colorInfo => {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('foreColor', false, colorInfo);
    });
    /**
     * insert Table
     *
     * @param {String} dimension of table (ex : "5x5")
     */

    this.insertTable = this.wrapCommand(dim => {
      const dimension = dim.split('x');
      const rng = this.getLastRange().deleteContents();
      rng.insertNode(this.table.createTable(dimension[0], dimension[1], this.options));
    });
    /**
     * remove media object and Figure Elements if media object is img with Figure.
     */

    this.removeMedia = this.wrapCommand(() => {
      let $target = external_jQuery_default()(this.restoreTarget()).parent();

      if ($target.closest('figure').length) {
        $target.closest('figure').remove();
      } else {
        $target = external_jQuery_default()(this.restoreTarget()).detach();
      }

      this.context.triggerEvent('media.delete', $target, this.$editable);
    });
    /**
     * float me
     *
     * @param {String} value
     */

    this.floatMe = this.wrapCommand(value => {
      const $target = external_jQuery_default()(this.restoreTarget());
      $target.toggleClass('note-float-left', value === 'left');
      $target.toggleClass('note-float-right', value === 'right');
      $target.css('float', value === 'none' ? '' : value);
    });
    /**
     * resize overlay element
     * @param {String} value
     */

    this.resize = this.wrapCommand(value => {
      const $target = external_jQuery_default()(this.restoreTarget());
      value = parseFloat(value);

      if (value === 0) {
        $target.css('width', '');
      } else {
        $target.css({
          width: value * 100 + '%',
          height: ''
        });
      }
    });
  }

  initialize() {
    // bind custom events
    this.$editable.on('keydown', event => {
      if (event.keyCode === core_key.code.ENTER) {
        this.context.triggerEvent('enter', event);
      }

      this.context.triggerEvent('keydown', event); // keep a snapshot to limit text on input event

      this.snapshot = this.history.makeSnapshot();

      if (!event.isDefaultPrevented()) {
        if (this.options.shortcuts) {
          this.handleKeyMap(event);
        } else {
          this.preventDefaultEditableShortCuts(event);
        }
      }

      if (this.isLimited(1, event)) {
        const lastRange = this.getLastRange();

        if (lastRange.eo - lastRange.so === 0) {
          return false;
        }
      }

      this.setLastRange();
    }).on('keyup', event => {
      this.setLastRange();
      this.context.triggerEvent('keyup', event);
    }).on('focus', event => {
      this.setLastRange();
      this.context.triggerEvent('focus', event);
    }).on('blur', event => {
      this.context.triggerEvent('blur', event);
    }).on('mousedown', event => {
      this.context.triggerEvent('mousedown', event);
    }).on('mouseup', event => {
      this.setLastRange();
      this.history.recordUndo();
      this.context.triggerEvent('mouseup', event);
    }).on('scroll', event => {
      this.context.triggerEvent('scroll', event);
    }).on('paste', event => {
      this.setLastRange();
      this.context.triggerEvent('paste', event);
    }).on('input', event => {
      // To limit composition characters (e.g. Korean)
      if (this.isLimited(0) && this.snapshot) {
        this.history.applySnapshot(this.snapshot);
      }
    });
    this.$editable.attr('spellcheck', this.options.spellCheck);
    this.$editable.attr('autocorrect', this.options.spellCheck);

    if (this.options.disableGrammar) {
      this.$editable.attr('data-gramm', false);
    } // init content before set event


    this.$editable.html(dom.html(this.$note) || dom.emptyPara);
    this.$editable.on(env.inputEventName, func.debounce(() => {
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }, 10));
    this.$editor.on('focusin', event => {
      this.context.triggerEvent('focusin', event);
    }).on('focusout', event => {
      this.context.triggerEvent('focusout', event);
    });

    if (!this.options.airMode) {
      if (this.options.width) {
        this.$editor.outerWidth(this.options.width);
      }

      if (this.options.height) {
        this.$editable.outerHeight(this.options.height);
      }

      if (this.options.maxHeight) {
        this.$editable.css('max-height', this.options.maxHeight);
      }

      if (this.options.minHeight) {
        this.$editable.css('min-height', this.options.minHeight);
      }
    }

    this.history.recordUndo();
    this.setLastRange();
  }

  destroy() {
    this.$editable.off();
  }

  handleKeyMap(event) {
    const keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
    const keys = [];

    if (event.metaKey) {
      keys.push('CMD');
    }

    if (event.ctrlKey && !event.altKey) {
      keys.push('CTRL');
    }

    if (event.shiftKey) {
      keys.push('SHIFT');
    }

    const keyName = core_key.nameFromCode[event.keyCode];

    if (keyName) {
      keys.push(keyName);
    }

    const eventName = keyMap[keys.join('+')];

    if (keyName === 'TAB' && !this.options.tabDisable) {
      this.afterCommand();
    } else if (eventName) {
      if (this.context.invoke(eventName) !== false) {
        event.preventDefault();
      }
    } else if (core_key.isEdit(event.keyCode)) {
      this.afterCommand();
    }
  }

  preventDefaultEditableShortCuts(event) {
    // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
    if ((event.ctrlKey || event.metaKey) && lists.contains([66, 73, 85], event.keyCode)) {
      event.preventDefault();
    }
  }

  isLimited(pad, event) {
    pad = pad || 0;

    if (typeof event !== 'undefined') {
      if (core_key.isMove(event.keyCode) || core_key.isNavigation(event.keyCode) || event.ctrlKey || event.metaKey || lists.contains([core_key.code.BACKSPACE, core_key.code.DELETE], event.keyCode)) {
        return false;
      }
    }

    if (this.options.maxTextLength > 0) {
      if (this.$editable.text().length + pad > this.options.maxTextLength) {
        return true;
      }
    }

    return false;
  }
  /**
   * create range
   * @return {WrappedRange}
   */


  createRange() {
    this.focus();
    this.setLastRange();
    return this.getLastRange();
  }

  setLastRange(rng) {
    if (rng) {
      this.lastRange = rng;
    } else {
      this.lastRange = core_range.create(this.editable);

      if (external_jQuery_default()(this.lastRange.sc).closest('.note-editable').length === 0) {
        this.lastRange = core_range.createFromBodyElement(this.editable);
      }
    }
  }

  getLastRange() {
    if (!this.lastRange) {
      this.setLastRange();
    }

    return this.lastRange;
  }
  /**
   * saveRange
   *
   * save current range
   *
   * @param {Boolean} [thenCollapse=false]
   */


  saveRange(thenCollapse) {
    if (thenCollapse) {
      this.getLastRange().collapse().select();
    }
  }
  /**
   * restoreRange
   *
   * restore lately range
   */


  restoreRange() {
    if (this.lastRange) {
      this.lastRange.select();
      this.focus();
    }
  }

  saveTarget(node) {
    this.$editable.data('target', node);
  }

  clearTarget() {
    this.$editable.removeData('target');
  }

  restoreTarget() {
    return this.$editable.data('target');
  }
  /**
   * currentStyle
   *
   * current style
   * @return {Object|Boolean} unfocus
   */


  currentStyle() {
    let rng = core_range.create();

    if (rng) {
      rng = rng.normalize();
    }

    return rng ? this.style.current(rng) : this.style.fromNode(this.$editable);
  }
  /**
   * style from node
   *
   * @param {jQuery} $node
   * @return {Object}
   */


  styleFromNode($node) {
    return this.style.fromNode($node);
  }
  /**
   * undo
   */


  undo() {
    this.context.triggerEvent('before.command', this.$editable.html());
    this.history.undo();
    this.context.triggerEvent('change', this.$editable.html(), this.$editable);
  }
  /*
  * commit
  */


  commit() {
    this.context.triggerEvent('before.command', this.$editable.html());
    this.history.commit();
    this.context.triggerEvent('change', this.$editable.html(), this.$editable);
  }
  /**
   * redo
   */


  redo() {
    this.context.triggerEvent('before.command', this.$editable.html());
    this.history.redo();
    this.context.triggerEvent('change', this.$editable.html(), this.$editable);
  }
  /**
   * before command
   */


  beforeCommand() {
    this.context.triggerEvent('before.command', this.$editable.html()); // keep focus on editable before command execution

    this.focus();
  }
  /**
   * after command
   * @param {Boolean} isPreventTrigger
   */


  afterCommand(isPreventTrigger) {
    this.normalizeContent();
    this.history.recordUndo();

    if (!isPreventTrigger) {
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }
  }
  /**
   * handle tab key
   */


  tab() {
    const rng = this.getLastRange();

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.table.tab(rng);
    } else {
      if (this.options.tabSize === 0) {
        return false;
      }

      if (!this.isLimited(this.options.tabSize)) {
        this.beforeCommand();
        this.typing.insertTab(rng, this.options.tabSize);
        this.afterCommand();
      }
    }
  }
  /**
   * handle shift+tab key
   */


  untab() {
    const rng = this.getLastRange();

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.table.tab(rng, true);
    } else {
      if (this.options.tabSize === 0) {
        return false;
      }
    }
  }
  /**
   * run given function between beforeCommand and afterCommand
   */


  wrapCommand(fn) {
    return function () {
      this.beforeCommand();
      fn.apply(this, arguments);
      this.afterCommand();
    };
  }
  /**
   * insert image
   *
   * @param {String} src
   * @param {String|Function} param
   * @return {Promise}
   */


  insertImage(src, param) {
    return createImage(src, param).then($image => {
      this.beforeCommand();

      if (typeof param === 'function') {
        param($image);
      } else {
        if (typeof param === 'string') {
          $image.attr('data-filename', param);
        }

        $image.css('width', Math.min(this.$editable.width(), $image.width()));
      }

      $image.show();
      this.getLastRange().insertNode($image[0]);
      this.setLastRange(core_range.createFromNodeAfter($image[0]).select());
      this.afterCommand();
    }).fail(e => {
      this.context.triggerEvent('image.upload.error', e);
    });
  }
  /**
   * insertImages
   * @param {File[]} files
   */


  insertImagesAsDataURL(files) {
    external_jQuery_default.a.each(files, (idx, file) => {
      const filename = file.name;

      if (this.options.maximumImageFileSize && this.options.maximumImageFileSize < file.size) {
        this.context.triggerEvent('image.upload.error', this.lang.image.maximumFileSizeError);
      } else {
        readFileAsDataURL(file).then(dataURL => {
          return this.insertImage(dataURL, filename);
        }).fail(() => {
          this.context.triggerEvent('image.upload.error');
        });
      }
    });
  }
  /**
   * insertImagesOrCallback
   * @param {File[]} files
   */


  insertImagesOrCallback(files) {
    const callbacks = this.options.callbacks; // If onImageUpload set,

    if (callbacks.onImageUpload) {
      this.context.triggerEvent('image.upload', files); // else insert Image as dataURL
    } else {
      this.insertImagesAsDataURL(files);
    }
  }
  /**
   * return selected plain text
   * @return {String} text
   */


  getSelectedText() {
    let rng = this.getLastRange(); // if range on anchor, expand range with anchor

    if (rng.isOnAnchor()) {
      rng = core_range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
    }

    return rng.toString();
  }

  onFormatBlock(tagName, $target) {
    // [workaround] for MSIE, IE need `<`
    document.execCommand('FormatBlock', false, env.isMSIE ? '<' + tagName + '>' : tagName); // support custom class

    if ($target && $target.length) {
      // find the exact element has given tagName
      if ($target[0].tagName.toUpperCase() !== tagName.toUpperCase()) {
        $target = $target.find(tagName);
      }

      if ($target && $target.length) {
        const className = $target[0].className || '';

        if (className) {
          const currentRange = this.createRange();
          const $parent = external_jQuery_default()([currentRange.sc, currentRange.ec]).closest(tagName);
          $parent.addClass(className);
        }
      }
    }
  }

  formatPara() {
    this.formatBlock('P');
  }

  fontStyling(target, value) {
    const rng = this.getLastRange();

    if (rng !== '') {
      const spans = this.style.styleNodes(rng);
      this.$editor.find('.note-status-output').html('');
      external_jQuery_default()(spans).css(target, value); // [workaround] added styled bogus span for style
      //  - also bogus character needed for cursor position

      if (rng.isCollapsed()) {
        const firstSpan = lists.head(spans);

        if (firstSpan && !dom.nodeLength(firstSpan)) {
          firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
          core_range.createFromNodeAfter(firstSpan.firstChild).select();
          this.setLastRange();
          this.$editable.data(KEY_BOGUS, firstSpan);
        }
      }
    } else {
      const noteStatusOutput = external_jQuery_default.a.now();
      this.$editor.find('.note-status-output').html('<div id="note-status-output-' + noteStatusOutput + '" class="alert alert-info">' + this.lang.output.noSelection + '</div>');
      setTimeout(function () {
        external_jQuery_default()('#note-status-output-' + noteStatusOutput).remove();
      }, 5000);
    }
  }
  /**
   * unlink
   *
   * @type command
   */


  unlink() {
    let rng = this.getLastRange();

    if (rng.isOnAnchor()) {
      const anchor = dom.ancestor(rng.sc, dom.isAnchor);
      rng = core_range.createFromNode(anchor);
      rng.select();
      this.setLastRange();
      this.beforeCommand();
      document.execCommand('unlink');
      this.afterCommand();
    }
  }
  /**
   * returns link info
   *
   * @return {Object}
   * @return {WrappedRange} return.range
   * @return {String} return.text
   * @return {Boolean} [return.isNewWindow=true]
   * @return {String} [return.url=""]
   */


  getLinkInfo() {
    const rng = this.getLastRange().expand(dom.isAnchor); // Get the first anchor on range(for edit).

    const $anchor = external_jQuery_default()(lists.head(rng.nodes(dom.isAnchor)));
    const linkInfo = {
      range: rng,
      text: rng.toString(),
      url: $anchor.length ? $anchor.attr('href') : ''
    }; // When anchor exists,

    if ($anchor.length) {
      // Set isNewWindow by checking its target.
      linkInfo.isNewWindow = $anchor.attr('target') === '_blank';
    }

    return linkInfo;
  }

  addRow(position) {
    const rng = this.getLastRange(this.$editable);

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.beforeCommand();
      this.table.addRow(rng, position);
      this.afterCommand();
    }
  }

  addCol(position) {
    const rng = this.getLastRange(this.$editable);

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.beforeCommand();
      this.table.addCol(rng, position);
      this.afterCommand();
    }
  }

  deleteRow() {
    const rng = this.getLastRange(this.$editable);

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.beforeCommand();
      this.table.deleteRow(rng);
      this.afterCommand();
    }
  }

  deleteCol() {
    const rng = this.getLastRange(this.$editable);

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.beforeCommand();
      this.table.deleteCol(rng);
      this.afterCommand();
    }
  }

  deleteTable() {
    const rng = this.getLastRange(this.$editable);

    if (rng.isCollapsed() && rng.isOnCell()) {
      this.beforeCommand();
      this.table.deleteTable(rng);
      this.afterCommand();
    }
  }
  /**
   * @param {Position} pos
   * @param {jQuery} $target - target element
   * @param {Boolean} [bKeepRatio] - keep ratio
   */


  resizeTo(pos, $target, bKeepRatio) {
    let imageSize;

    if (bKeepRatio) {
      const newRatio = pos.y / pos.x;
      const ratio = $target.data('ratio');
      imageSize = {
        width: ratio > newRatio ? pos.x : pos.y / ratio,
        height: ratio > newRatio ? pos.x * ratio : pos.y
      };
    } else {
      imageSize = {
        width: pos.x,
        height: pos.y
      };
    }

    $target.css(imageSize);
  }
  /**
   * returns whether editable area has focus or not.
   */


  hasFocus() {
    return this.$editable.is(':focus');
  }
  /**
   * set focus
   */


  focus() {
    // [workaround] Screen will move when page is scolled in IE.
    //  - do focus when not focused
    if (!this.hasFocus()) {
      this.$editable.focus();
    }
  }
  /**
   * returns whether contents is empty or not.
   * @return {Boolean}
   */


  isEmpty() {
    return dom.isEmpty(this.$editable[0]) || dom.emptyPara === this.$editable.html();
  }
  /**
   * Removes all contents and restores the editable instance to an _emptyPara_.
   */


  empty() {
    this.context.invoke('code', dom.emptyPara);
  }
  /**
   * normalize content
   */


  normalizeContent() {
    this.$editable[0].normalize();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Clipboard.js

class Clipboard_Clipboard {
  constructor(context) {
    this.context = context;
    this.$editable = context.layoutInfo.editable;
  }

  initialize() {
    this.$editable.on('paste', this.pasteByEvent.bind(this));
  }
  /**
   * paste by clipboard event
   *
   * @param {Event} event
   */


  pasteByEvent(event) {
    const clipboardData = event.originalEvent.clipboardData;

    if (clipboardData && clipboardData.items && clipboardData.items.length) {
      const item = clipboardData.items.length > 1 ? clipboardData.items[1] : lists.head(clipboardData.items);

      if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
        // paste img file
        this.context.invoke('editor.insertImagesOrCallback', [item.getAsFile()]);
        event.preventDefault();
        this.context.invoke('editor.afterCommand');
      } else if (item.kind === 'string') {
        // paste text with maxTextLength check
        if (this.context.invoke('editor.isLimited', clipboardData.getData('Text').length)) {
          event.preventDefault();
        } else {
          this.context.invoke('editor.afterCommand');
        }
      }
    }
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Dropzone.js

class Dropzone_Dropzone {
  constructor(context) {
    this.context = context;
    this.$eventListener = external_jQuery_default()(document);
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.documentEventHandlers = {};
    this.$dropzone = external_jQuery_default()(['<div class="note-dropzone">', '<div class="note-dropzone-message"/>', '</div>'].join('')).prependTo(this.$editor);
  }
  /**
   * attach Drag and Drop Events
   */


  initialize() {
    if (this.options.disableDragAndDrop) {
      // prevent default drop event
      this.documentEventHandlers.onDrop = e => {
        e.preventDefault();
      }; // do not consider outside of dropzone


      this.$eventListener = this.$dropzone;
      this.$eventListener.on('drop', this.documentEventHandlers.onDrop);
    } else {
      this.attachDragAndDropEvent();
    }
  }
  /**
   * attach Drag and Drop Events
   */


  attachDragAndDropEvent() {
    let collection = external_jQuery_default()();
    const $dropzoneMessage = this.$dropzone.find('.note-dropzone-message');

    this.documentEventHandlers.onDragenter = e => {
      const isCodeview = this.context.invoke('codeview.isActivated');
      const hasEditorSize = this.$editor.width() > 0 && this.$editor.height() > 0;

      if (!isCodeview && !collection.length && hasEditorSize) {
        this.$editor.addClass('dragover');
        this.$dropzone.width(this.$editor.width());
        this.$dropzone.height(this.$editor.height());
        $dropzoneMessage.text(this.lang.image.dragImageHere);
      }

      collection = collection.add(e.target);
    };

    this.documentEventHandlers.onDragleave = e => {
      collection = collection.not(e.target); // If nodeName is BODY, then just make it over (fix for IE)

      if (!collection.length || e.target.nodeName === 'BODY') {
        collection = external_jQuery_default()();
        this.$editor.removeClass('dragover');
      }
    };

    this.documentEventHandlers.onDrop = () => {
      collection = external_jQuery_default()();
      this.$editor.removeClass('dragover');
    }; // show dropzone on dragenter when dragging a object to document
    // -but only if the editor is visible, i.e. has a positive width and height


    this.$eventListener.on('dragenter', this.documentEventHandlers.onDragenter).on('dragleave', this.documentEventHandlers.onDragleave).on('drop', this.documentEventHandlers.onDrop); // change dropzone's message on hover.

    this.$dropzone.on('dragenter', () => {
      this.$dropzone.addClass('hover');
      $dropzoneMessage.text(this.lang.image.dropImage);
    }).on('dragleave', () => {
      this.$dropzone.removeClass('hover');
      $dropzoneMessage.text(this.lang.image.dragImageHere);
    }); // attach dropImage

    this.$dropzone.on('drop', event => {
      const dataTransfer = event.originalEvent.dataTransfer; // stop the browser from opening the dropped content

      event.preventDefault();

      if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
        this.$editable.focus();
        this.context.invoke('editor.insertImagesOrCallback', dataTransfer.files);
      } else {
        external_jQuery_default.a.each(dataTransfer.types, (idx, type) => {
          // skip moz-specific types
          if (type.toLowerCase().indexOf('_moz_') > -1) {
            return;
          }

          const content = dataTransfer.getData(type);

          if (type.toLowerCase().indexOf('text') > -1) {
            this.context.invoke('editor.pasteHTML', content);
          } else {
            external_jQuery_default()(content).each((idx, item) => {
              this.context.invoke('editor.insertNode', item);
            });
          }
        });
      }
    }).on('dragover', false); // prevent default dragover event
  }

  destroy() {
    Object.keys(this.documentEventHandlers).forEach(key => {
      this.$eventListener.off(key.substr(2).toLowerCase(), this.documentEventHandlers[key]);
    });
    this.documentEventHandlers = {};
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Codeview.js


let CodeMirror;

if (env.hasCodeMirror) {
  CodeMirror = window.CodeMirror;
}
/**
 * @class Codeview
 */


class Codeview_CodeView {
  constructor(context) {
    this.context = context;
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.options = context.options;
  }

  sync() {
    const isCodeview = this.isActivated();

    if (isCodeview && env.hasCodeMirror) {
      this.$codable.data('cmEditor').save();
    }
  }
  /**
   * @return {Boolean}
   */


  isActivated() {
    return this.$editor.hasClass('codeview');
  }
  /**
   * toggle codeview
   */


  toggle() {
    if (this.isActivated()) {
      this.deactivate();
    } else {
      this.activate();
    }

    this.context.triggerEvent('codeview.toggled');
  }
  /**
   * purify input value
   * @param value
   * @returns {*}
   */


  purify(value) {
    if (this.options.codeviewFilter) {
      // filter code view regex
      value = value.replace(this.options.codeviewFilterRegex, ''); // allow specific iframe tag

      if (this.options.codeviewIframeFilter) {
        const whitelist = this.options.codeviewIframeWhitelistSrc.concat(this.options.codeviewIframeWhitelistSrcBase);
        value = value.replace(/(<iframe.*?>.*?(?:<\/iframe>)?)/gi, function (tag) {
          // remove if src attribute is duplicated
          if (/<.+src(?==?('|"|\s)?)[\s\S]+src(?=('|"|\s)?)[^>]*?>/i.test(tag)) {
            return '';
          }

          for (const src of whitelist) {
            // pass if src is trusted
            if (new RegExp('src="(https?:)?\/\/' + src.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\/(.+)"').test(tag)) {
              return tag;
            }
          }

          return '';
        });
      }
    }

    return value;
  }
  /**
   * activate code view
   */


  activate() {
    this.$codable.val(dom.html(this.$editable, this.options.prettifyHtml));
    this.$codable.height(this.$editable.height());
    this.context.invoke('toolbar.updateCodeview', true);
    this.$editor.addClass('codeview');
    this.$codable.focus(); // activate CodeMirror as codable

    if (env.hasCodeMirror) {
      const cmEditor = CodeMirror.fromTextArea(this.$codable[0], this.options.codemirror); // CodeMirror TernServer

      if (this.options.codemirror.tern) {
        const server = new CodeMirror.TernServer(this.options.codemirror.tern);
        cmEditor.ternServer = server;
        cmEditor.on('cursorActivity', cm => {
          server.updateArgHints(cm);
        });
      }

      cmEditor.on('blur', event => {
        this.context.triggerEvent('blur.codeview', cmEditor.getValue(), event);
      });
      cmEditor.on('change', event => {
        this.context.triggerEvent('change.codeview', cmEditor.getValue(), cmEditor);
      }); // CodeMirror hasn't Padding.

      cmEditor.setSize(null, this.$editable.outerHeight());
      this.$codable.data('cmEditor', cmEditor);
    } else {
      this.$codable.on('blur', event => {
        this.context.triggerEvent('blur.codeview', this.$codable.val(), event);
      });
      this.$codable.on('input', event => {
        this.context.triggerEvent('change.codeview', this.$codable.val(), this.$codable);
      });
    }
  }
  /**
   * deactivate code view
   */


  deactivate() {
    // deactivate CodeMirror as codable
    if (env.hasCodeMirror) {
      const cmEditor = this.$codable.data('cmEditor');
      this.$codable.val(cmEditor.getValue());
      cmEditor.toTextArea();
    }

    const value = this.purify(dom.value(this.$codable, this.options.prettifyHtml) || dom.emptyPara);
    const isChange = this.$editable.html() !== value;
    this.$editable.html(value);
    this.$editable.height(this.options.height ? this.$codable.height() : 'auto');
    this.$editor.removeClass('codeview');

    if (isChange) {
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }

    this.$editable.focus();
    this.context.invoke('toolbar.updateCodeview', false);
  }

  destroy() {
    if (this.isActivated()) {
      this.deactivate();
    }
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Statusbar.js

const EDITABLE_PADDING = 24;
class Statusbar_Statusbar {
  constructor(context) {
    this.$document = external_jQuery_default()(document);
    this.$statusbar = context.layoutInfo.statusbar;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
  }

  initialize() {
    if (this.options.airMode || this.options.disableResizeEditor) {
      this.destroy();
      return;
    }

    this.$statusbar.on('mousedown', event => {
      event.preventDefault();
      event.stopPropagation();
      const editableTop = this.$editable.offset().top - this.$document.scrollTop();

      const onMouseMove = event => {
        let height = event.clientY - (editableTop + EDITABLE_PADDING);
        height = this.options.minheight > 0 ? Math.max(height, this.options.minheight) : height;
        height = this.options.maxHeight > 0 ? Math.min(height, this.options.maxHeight) : height;
        this.$editable.height(height);
      };

      this.$document.on('mousemove', onMouseMove).one('mouseup', () => {
        this.$document.off('mousemove', onMouseMove);
      });
    });
  }

  destroy() {
    this.$statusbar.off();
    this.$statusbar.addClass('locked');
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Fullscreen.js

class Fullscreen_Fullscreen {
  constructor(context) {
    this.context = context;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.$window = external_jQuery_default()(window);
    this.$scrollbar = external_jQuery_default()('html, body');

    this.onResize = () => {
      this.resizeTo({
        h: this.$window.height() - this.$toolbar.outerHeight()
      });
    };
  }

  resizeTo(size) {
    this.$editable.css('height', size.h);
    this.$codable.css('height', size.h);

    if (this.$codable.data('cmeditor')) {
      this.$codable.data('cmeditor').setsize(null, size.h);
    }
  }
  /**
   * toggle fullscreen
   */


  toggle() {
    this.$editor.toggleClass('fullscreen');

    if (this.isFullscreen()) {
      this.$editable.data('orgHeight', this.$editable.css('height'));
      this.$editable.data('orgMaxHeight', this.$editable.css('maxHeight'));
      this.$editable.css('maxHeight', '');
      this.$window.on('resize', this.onResize).trigger('resize');
      this.$scrollbar.css('overflow', 'hidden');
    } else {
      this.$window.off('resize', this.onResize);
      this.resizeTo({
        h: this.$editable.data('orgHeight')
      });
      this.$editable.css('maxHeight', this.$editable.css('orgMaxHeight'));
      this.$scrollbar.css('overflow', 'visible');
    }

    this.context.invoke('toolbar.updateFullscreen', this.isFullscreen());
  }

  isFullscreen() {
    return this.$editor.hasClass('fullscreen');
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Handle.js


class Handle_Handle {
  constructor(context) {
    this.context = context;
    this.$document = external_jQuery_default()(document);
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.events = {
      'summernote.mousedown': (we, e) => {
        if (this.update(e.target, e)) {
          e.preventDefault();
        }
      },
      'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': () => {
        this.update();
      },
      'summernote.disable summernote.blur': () => {
        this.hide();
      },
      'summernote.codeview.toggled': () => {
        this.update();
      }
    };
  }

  initialize() {
    this.$handle = external_jQuery_default()(['<div class="note-handle">', '<div class="note-control-selection">', '<div class="note-control-selection-bg"></div>', '<div class="note-control-holder note-control-nw"></div>', '<div class="note-control-holder note-control-ne"></div>', '<div class="note-control-holder note-control-sw"></div>', '<div class="', this.options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing', ' note-control-se"></div>', this.options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>', '</div>', '</div>'].join('')).prependTo(this.$editingArea);
    this.$handle.on('mousedown', event => {
      if (dom.isControlSizing(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        const $target = this.$handle.find('.note-control-selection').data('target');
        const posStart = $target.offset();
        const scrollTop = this.$document.scrollTop();

        const onMouseMove = event => {
          this.context.invoke('editor.resizeTo', {
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);
          this.update($target[0], event);
        };

        this.$document.on('mousemove', onMouseMove).one('mouseup', e => {
          e.preventDefault();
          this.$document.off('mousemove', onMouseMove);
          this.context.invoke('editor.afterCommand');
        });

        if (!$target.data('ratio')) {
          // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }
      }
    }); // Listen for scrolling on the handle overlay.

    this.$handle.on('wheel', e => {
      e.preventDefault();
      this.update();
    });
  }

  destroy() {
    this.$handle.remove();
  }

  update(target, event) {
    if (this.context.isDisabled()) {
      return false;
    }

    const isImage = dom.isImg(target);
    const $selection = this.$handle.find('.note-control-selection');
    this.context.invoke('imagePopover.update', target, event);

    if (isImage) {
      const $image = external_jQuery_default()(target);
      const position = $image.position();
      const pos = {
        left: position.left + parseInt($image.css('marginLeft'), 10),
        top: position.top + parseInt($image.css('marginTop'), 10)
      }; // exclude margin

      const imageSize = {
        w: $image.outerWidth(false),
        h: $image.outerHeight(false)
      };
      $selection.css({
        display: 'block',
        left: pos.left,
        top: pos.top,
        width: imageSize.w,
        height: imageSize.h
      }).data('target', $image); // save current image element.

      const origImageObj = new Image();
      origImageObj.src = $image.attr('src');
      const sizingText = imageSize.w + 'x' + imageSize.h + ' (' + this.lang.image.original + ': ' + origImageObj.width + 'x' + origImageObj.height + ')';
      $selection.find('.note-control-selection-info').text(sizingText);
      this.context.invoke('editor.saveTarget', target);
    } else {
      this.hide();
    }

    return isImage;
  }
  /**
   * hide
   *
   * @param {jQuery} $handle
   */


  hide() {
    this.context.invoke('editor.clearTarget');
    this.$handle.children().hide();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/AutoLink.js



const defaultScheme = 'http://';
const linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/]{2}|tel:|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;
class AutoLink_AutoLink {
  constructor(context) {
    this.context = context;
    this.events = {
      'summernote.keyup': (we, e) => {
        if (!e.isDefaultPrevented()) {
          this.handleKeyup(e);
        }
      },
      'summernote.keydown': (we, e) => {
        this.handleKeydown(e);
      }
    };
  }

  initialize() {
    this.lastWordRange = null;
  }

  destroy() {
    this.lastWordRange = null;
  }

  replace() {
    if (!this.lastWordRange) {
      return;
    }

    const keyword = this.lastWordRange.toString();
    const match = keyword.match(linkPattern);

    if (match && (match[1] || match[2])) {
      const link = match[1] ? keyword : defaultScheme + keyword;
      const urlText = keyword.replace(/^(?:https?:\/\/)?(?:tel?:?)?(?:mailto?:?)?(?:www\.)?/i, '').split('/')[0];
      const node = external_jQuery_default()('<a />').html(urlText).attr('href', link)[0];

      if (this.context.options.linkTargetBlank) {
        external_jQuery_default()(node).attr('target', '_blank');
      }

      this.lastWordRange.insertNode(node);
      this.lastWordRange = null;
      this.context.invoke('editor.focus');
    }
  }

  handleKeydown(e) {
    if (lists.contains([core_key.code.ENTER, core_key.code.SPACE], e.keyCode)) {
      const wordRange = this.context.invoke('editor.createRange').getWordRange();
      this.lastWordRange = wordRange;
    }
  }

  handleKeyup(e) {
    if (lists.contains([core_key.code.ENTER, core_key.code.SPACE], e.keyCode)) {
      this.replace();
    }
  }

}
// CONCATENATED MODULE: ./src/js/base/module/AutoSync.js

/**
 * textarea auto sync.
 */

class AutoSync_AutoSync {
  constructor(context) {
    this.$note = context.layoutInfo.note;
    this.events = {
      'summernote.change': () => {
        this.$note.val(context.invoke('code'));
      }
    };
  }

  shouldInitialize() {
    return dom.isTextarea(this.$note[0]);
  }

}
// CONCATENATED MODULE: ./src/js/base/module/AutoReplace.js



class AutoReplace_AutoReplace {
  constructor(context) {
    this.context = context;
    this.options = context.options.replace || {};
    this.keys = [core_key.code.ENTER, core_key.code.SPACE, core_key.code.PERIOD, core_key.code.COMMA, core_key.code.SEMICOLON, core_key.code.SLASH];
    this.previousKeydownCode = null;
    this.events = {
      'summernote.keyup': (we, e) => {
        if (!e.isDefaultPrevented()) {
          this.handleKeyup(e);
        }
      },
      'summernote.keydown': (we, e) => {
        this.handleKeydown(e);
      }
    };
  }

  shouldInitialize() {
    return !!this.options.match;
  }

  initialize() {
    this.lastWord = null;
  }

  destroy() {
    this.lastWord = null;
  }

  replace() {
    if (!this.lastWord) {
      return;
    }

    const self = this;
    const keyword = this.lastWord.toString();
    this.options.match(keyword, function (match) {
      if (match) {
        let node = '';

        if (typeof match === 'string') {
          node = dom.createText(match);
        } else if (match instanceof jQuery) {
          node = match[0];
        } else if (match instanceof Node) {
          node = match;
        }

        if (!node) return;
        self.lastWord.insertNode(node);
        self.lastWord = null;
        self.context.invoke('editor.focus');
      }
    });
  }

  handleKeydown(e) {
    // this forces it to remember the last whole word, even if multiple termination keys are pressed
    // before the previous key is let go.
    if (this.previousKeydownCode && lists.contains(this.keys, this.previousKeydownCode)) {
      this.previousKeydownCode = e.keyCode;
      return;
    }

    if (lists.contains(this.keys, e.keyCode)) {
      const wordRange = this.context.invoke('editor.createRange').getWordRange();
      this.lastWord = wordRange;
    }

    this.previousKeydownCode = e.keyCode;
  }

  handleKeyup(e) {
    if (lists.contains(this.keys, e.keyCode)) {
      this.replace();
    }
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Placeholder.js

class Placeholder_Placeholder {
  constructor(context) {
    this.context = context;
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;

    if (this.options.inheritPlaceholder === true) {
      // get placeholder value from the original element
      this.options.placeholder = this.context.$note.attr('placeholder') || this.options.placeholder;
    }

    this.events = {
      'summernote.init summernote.change': () => {
        this.update();
      },
      'summernote.codeview.toggled': () => {
        this.update();
      }
    };
  }

  shouldInitialize() {
    return !!this.options.placeholder;
  }

  initialize() {
    this.$placeholder = external_jQuery_default()('<div class="note-placeholder">');
    this.$placeholder.on('click', () => {
      this.context.invoke('focus');
    }).html(this.options.placeholder).prependTo(this.$editingArea);
    this.update();
  }

  destroy() {
    this.$placeholder.remove();
  }

  update() {
    const isShow = !this.context.invoke('codeview.isActivated') && this.context.invoke('editor.isEmpty');
    this.$placeholder.toggle(isShow);
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Buttons.js




class Buttons_Buttons {
  constructor(context) {
    this.ui = external_jQuery_default.a.summernote.ui;
    this.context = context;
    this.$toolbar = context.layoutInfo.toolbar;
    this.options = context.options;
    this.lang = this.options.langInfo;
    this.invertedKeyMap = func.invertObject(this.options.keyMap[env.isMac ? 'mac' : 'pc']);
  }

  representShortcut(editorMethod) {
    let shortcut = this.invertedKeyMap[editorMethod];

    if (!this.options.shortcuts || !shortcut) {
      return '';
    }

    if (env.isMac) {
      shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
    }

    shortcut = shortcut.replace('BACKSLASH', '\\').replace('SLASH', '/').replace('LEFTBRACKET', '[').replace('RIGHTBRACKET', ']');
    return ' (' + shortcut + ')';
  }

  button(o) {
    if (!this.options.tooltip && o.tooltip) {
      delete o.tooltip;
    }

    o.container = this.options.container;
    return this.ui.button(o);
  }

  initialize() {
    this.addToolbarButtons();
    this.addImagePopoverButtons();
    this.addLinkPopoverButtons();
    this.addTablePopoverButtons();
    this.fontInstalledMap = {};
  }

  destroy() {
    delete this.fontInstalledMap;
  }

  isFontInstalled(name) {
    if (!this.fontInstalledMap.hasOwnProperty(name)) {
      this.fontInstalledMap[name] = env.isFontInstalled(name) || lists.contains(this.options.fontNamesIgnoreCheck, name);
    }

    return this.fontInstalledMap[name];
  }

  isFontDeservedToAdd(name) {
    name = name.toLowerCase();
    return name !== '' && this.isFontInstalled(name) && env.genericFontFamilies.indexOf(name) === -1;
  }

  colorPalette(className, tooltip, backColor, foreColor) {
    return this.ui.buttonGroup({
      className: 'note-color ' + className,
      children: [this.button({
        className: 'note-current-color-button',
        contents: this.ui.icon(this.options.icons.font + ' note-recent-color'),
        tooltip: tooltip,
        click: e => {
          const $button = external_jQuery_default()(e.currentTarget);

          if (backColor && foreColor) {
            this.context.invoke('editor.color', {
              backColor: $button.attr('data-backColor'),
              foreColor: $button.attr('data-foreColor')
            });
          } else if (backColor) {
            this.context.invoke('editor.color', {
              backColor: $button.attr('data-backColor')
            });
          } else if (foreColor) {
            this.context.invoke('editor.color', {
              foreColor: $button.attr('data-foreColor')
            });
          }
        },
        callback: $button => {
          const $recentColor = $button.find('.note-recent-color');

          if (backColor) {
            $recentColor.css('background-color', this.options.colorButton.backColor);
            $button.attr('data-backColor', this.options.colorButton.backColor);
          }

          if (foreColor) {
            $recentColor.css('color', this.options.colorButton.foreColor);
            $button.attr('data-foreColor', this.options.colorButton.foreColor);
          } else {
            $recentColor.css('color', 'transparent');
          }
        }
      }), this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents('', this.options),
        tooltip: this.lang.color.more,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdown({
        items: (backColor ? ['<div class="note-palette">', '<div class="note-palette-title">' + this.lang.color.background + '</div>', '<div>', '<button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">', this.lang.color.transparent, '</button>', '</div>', '<div class="note-holder" data-event="backColor"/>', '<div>', '<button type="button" class="note-color-select btn" data-event="openPalette" data-value="backColorPicker">', this.lang.color.cpSelect, '</button>', '<input type="color" id="backColorPicker" class="note-btn note-color-select-btn" value="' + this.options.colorButton.backColor + '" data-event="backColorPalette">', '</div>', '<div class="note-holder-custom" id="backColorPalette" data-event="backColor"/>', '</div>'].join('') : '') + (foreColor ? ['<div class="note-palette">', '<div class="note-palette-title">' + this.lang.color.foreground + '</div>', '<div>', '<button type="button" class="note-color-reset btn btn-light" data-event="removeFormat" data-value="foreColor">', this.lang.color.resetToDefault, '</button>', '</div>', '<div class="note-holder" data-event="foreColor"/>', '<div>', '<button type="button" class="note-color-select btn" data-event="openPalette" data-value="foreColorPicker">', this.lang.color.cpSelect, '</button>', '<input type="color" id="foreColorPicker" class="note-btn note-color-select-btn" value="' + this.options.colorButton.foreColor + '" data-event="foreColorPalette">', '</div>', // Fix missing Div, Commented to find easily if it's wrong
        '<div class="note-holder-custom" id="foreColorPalette" data-event="foreColor"/>', '</div>'].join('') : ''),
        callback: $dropdown => {
          $dropdown.find('.note-holder').each((idx, item) => {
            const $holder = external_jQuery_default()(item);
            $holder.append(this.ui.palette({
              colors: this.options.colors,
              colorsName: this.options.colorsName,
              eventName: $holder.data('event'),
              container: this.options.container,
              tooltip: this.options.tooltip
            }).render());
          });
          /* TODO: do we have to record recent custom colors within cookies? */

          var customColors = [['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']];
          $dropdown.find('.note-holder-custom').each((idx, item) => {
            const $holder = external_jQuery_default()(item);
            $holder.append(this.ui.palette({
              colors: customColors,
              colorsName: customColors,
              eventName: $holder.data('event'),
              container: this.options.container,
              tooltip: this.options.tooltip
            }).render());
          });
          $dropdown.find('input[type=color]').each((idx, item) => {
            external_jQuery_default()(item).change(function () {
              const $chip = $dropdown.find('#' + external_jQuery_default()(this).data('event')).find('.note-color-btn').first();
              const color = this.value.toUpperCase();
              $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
              $chip.click();
            });
          });
        },
        click: event => {
          event.stopPropagation();
          const $parent = external_jQuery_default()('.' + className).find('.show');
          const $button = external_jQuery_default()(event.target);
          const eventName = $button.data('event');
          let value = $button.attr('data-value');

          if (eventName === 'openPalette') {
            const $picker = $parent.find('#' + value);
            const $palette = external_jQuery_default()($parent.find('#' + $picker.data('event')).find('.note-color-row')[0]); // Shift palette chips

            const $chip = $palette.find('.note-color-btn').last().detach(); // Set chip attributes

            const color = $picker.val();
            $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
            $palette.prepend($chip);
            $picker.click();
          } else if (lists.contains(['backColor', 'foreColor'], eventName)) {
            const key = eventName === 'backColor' ? 'background-color' : 'color';
            const $color = $button.closest('.note-color').find('.note-recent-color');
            const $currentButton = $button.closest('.note-color').find('.note-current-color-button');
            $color.css(key, value);
            $currentButton.attr('data-' + eventName, value);
            this.context.invoke('editor.' + eventName, value);
          }
        }
      })]
    }).render();
  }

  addToolbarButtons() {
    this.context.memo('button.style', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.magic), this.options),
        tooltip: this.lang.style.style,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdown({
        className: 'dropdown-style',
        items: this.options.styleTags,
        title: this.lang.style.style,
        template: item => {
          if (typeof item === 'string') {
            item = {
              tag: item,
              title: this.lang.style.hasOwnProperty(item) ? this.lang.style[item] : item
            };
          }

          const tag = item.tag;
          const title = item.title;
          const style = item.style ? ' style="' + item.style + '" ' : '';
          const className = item.className ? ' class="' + item.className + '"' : '';
          return '<' + tag + style + className + '>' + title + '</' + tag + '>';
        },
        click: this.context.createInvokeHandler('editor.formatBlock')
      })]).render();
    });

    for (let styleIdx = 0, styleLen = this.options.styleTags.length; styleIdx < styleLen; styleIdx++) {
      const item = this.options.styleTags[styleIdx];
      this.context.memo('button.style.' + item, () => {
        return this.button({
          className: 'note-btn-style-' + item,
          contents: '<div data-value="' + item + '">' + item.toUpperCase() + '</div>',
          tooltip: this.lang.style[item],
          click: this.context.createInvokeHandler('editor.formatBlock')
        }).render();
      });
    }

    this.context.memo('button.bold', () => {
      return this.button({
        className: 'note-btn-bold',
        contents: this.ui.icon(this.options.icons.bold),
        tooltip: this.lang.font.bold + this.representShortcut('bold'),
        click: this.context.createInvokeHandlerAndUpdateState('editor.bold')
      }).render();
    });
    this.context.memo('button.italic', () => {
      return this.button({
        className: 'note-btn-italic',
        contents: this.ui.icon(this.options.icons.italic),
        tooltip: this.lang.font.italic + this.representShortcut('italic'),
        click: this.context.createInvokeHandlerAndUpdateState('editor.italic')
      }).render();
    });
    this.context.memo('button.underline', () => {
      return this.button({
        className: 'note-btn-underline',
        contents: this.ui.icon(this.options.icons.underline),
        tooltip: this.lang.font.underline + this.representShortcut('underline'),
        click: this.context.createInvokeHandlerAndUpdateState('editor.underline')
      }).render();
    });
    this.context.memo('button.clear', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.eraser),
        tooltip: this.lang.font.clear + this.representShortcut('removeFormat'),
        click: this.context.createInvokeHandler('editor.removeFormat')
      }).render();
    });
    this.context.memo('button.strikethrough', () => {
      return this.button({
        className: 'note-btn-strikethrough',
        contents: this.ui.icon(this.options.icons.strikethrough),
        tooltip: this.lang.font.strikethrough + this.representShortcut('strikethrough'),
        click: this.context.createInvokeHandlerAndUpdateState('editor.strikethrough')
      }).render();
    });
    this.context.memo('button.superscript', () => {
      return this.button({
        className: 'note-btn-superscript',
        contents: this.ui.icon(this.options.icons.superscript),
        tooltip: this.lang.font.superscript,
        click: this.context.createInvokeHandlerAndUpdateState('editor.superscript')
      }).render();
    });
    this.context.memo('button.subscript', () => {
      return this.button({
        className: 'note-btn-subscript',
        contents: this.ui.icon(this.options.icons.subscript),
        tooltip: this.lang.font.subscript,
        click: this.context.createInvokeHandlerAndUpdateState('editor.subscript')
      }).render();
    });
    this.context.memo('button.fontname', () => {
      const styleInfo = this.context.invoke('editor.currentStyle');

      if (this.options.addDefaultFonts) {
        // Add 'default' fonts into the fontnames array if not exist
        external_jQuery_default.a.each(styleInfo['font-family'].split(','), (idx, fontname) => {
          fontname = fontname.trim().replace(/['"]+/g, '');

          if (this.isFontDeservedToAdd(fontname)) {
            if (this.options.fontNames.indexOf(fontname) === -1) {
              this.options.fontNames.push(fontname);
            }
          }
        });
      }

      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents('<span class="note-current-fontname"/>', this.options),
        tooltip: this.lang.font.name,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdownCheck({
        className: 'dropdown-fontname',
        checkClassName: this.options.icons.menuCheck,
        items: this.options.fontNames.filter(this.isFontInstalled.bind(this)),
        title: this.lang.font.name,
        template: item => {
          return '<span style="font-family: ' + env.validFontName(item) + '">' + item + '</span>';
        },
        click: this.context.createInvokeHandlerAndUpdateState('editor.fontName')
      })]).render();
    });
    this.context.memo('button.fontsize', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents('<span class="note-current-fontsize"/>', this.options),
        tooltip: this.lang.font.size,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdownCheck({
        className: 'dropdown-fontsize',
        checkClassName: this.options.icons.menuCheck,
        items: this.options.fontSizes,
        title: this.lang.font.size,
        click: this.context.createInvokeHandlerAndUpdateState('editor.fontSize')
      })]).render();
    });
    this.context.memo('button.fontsizeunit', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents('<span class="note-current-fontsizeunit"/>', this.options),
        tooltip: this.lang.font.sizeunit,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdownCheck({
        className: 'dropdown-fontsizeunit',
        checkClassName: this.options.icons.menuCheck,
        items: this.options.fontSizeUnits,
        title: this.lang.font.sizeunit,
        click: this.context.createInvokeHandlerAndUpdateState('editor.fontSizeUnit')
      })]).render();
    });
    this.context.memo('button.color', () => {
      return this.colorPalette('note-color-all', this.lang.color.recent, true, true);
    });
    this.context.memo('button.forecolor', () => {
      return this.colorPalette('note-color-fore', this.lang.color.foreground, false, true);
    });
    this.context.memo('button.backcolor', () => {
      return this.colorPalette('note-color-back', this.lang.color.background, true, false);
    });
    this.context.memo('button.ul', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.unorderedlist),
        tooltip: this.lang.lists.unordered + this.representShortcut('insertUnorderedList'),
        click: this.context.createInvokeHandler('editor.insertUnorderedList')
      }).render();
    });
    this.context.memo('button.ol', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.orderedlist),
        tooltip: this.lang.lists.ordered + this.representShortcut('insertOrderedList'),
        click: this.context.createInvokeHandler('editor.insertOrderedList')
      }).render();
    });
    const justifyLeft = this.button({
      contents: this.ui.icon(this.options.icons.alignLeft),
      tooltip: this.lang.paragraph.left + this.representShortcut('justifyLeft'),
      click: this.context.createInvokeHandler('editor.justifyLeft')
    });
    const justifyCenter = this.button({
      contents: this.ui.icon(this.options.icons.alignCenter),
      tooltip: this.lang.paragraph.center + this.representShortcut('justifyCenter'),
      click: this.context.createInvokeHandler('editor.justifyCenter')
    });
    const justifyRight = this.button({
      contents: this.ui.icon(this.options.icons.alignRight),
      tooltip: this.lang.paragraph.right + this.representShortcut('justifyRight'),
      click: this.context.createInvokeHandler('editor.justifyRight')
    });
    const justifyFull = this.button({
      contents: this.ui.icon(this.options.icons.alignJustify),
      tooltip: this.lang.paragraph.justify + this.representShortcut('justifyFull'),
      click: this.context.createInvokeHandler('editor.justifyFull')
    });
    const outdent = this.button({
      contents: this.ui.icon(this.options.icons.outdent),
      tooltip: this.lang.paragraph.outdent + this.representShortcut('outdent'),
      click: this.context.createInvokeHandler('editor.outdent')
    });
    const indent = this.button({
      contents: this.ui.icon(this.options.icons.indent),
      tooltip: this.lang.paragraph.indent + this.representShortcut('indent'),
      click: this.context.createInvokeHandler('editor.indent')
    });
    this.context.memo('button.justifyLeft', func.invoke(justifyLeft, 'render'));
    this.context.memo('button.justifyCenter', func.invoke(justifyCenter, 'render'));
    this.context.memo('button.justifyRight', func.invoke(justifyRight, 'render'));
    this.context.memo('button.justifyFull', func.invoke(justifyFull, 'render'));
    this.context.memo('button.outdent', func.invoke(outdent, 'render'));
    this.context.memo('button.indent', func.invoke(indent, 'render'));
    this.context.memo('button.paragraph', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.alignLeft), this.options),
        tooltip: this.lang.paragraph.paragraph,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdown([this.ui.buttonGroup({
        className: 'note-align',
        children: [justifyLeft, justifyCenter, justifyRight, justifyFull]
      }), this.ui.buttonGroup({
        className: 'note-list',
        children: [outdent, indent]
      })])]).render();
    });
    this.context.memo('button.height', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.textHeight), this.options),
        tooltip: this.lang.font.height,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdownCheck({
        items: this.options.lineHeights,
        checkClassName: this.options.icons.menuCheck,
        className: 'dropdown-line-height',
        title: this.lang.font.height,
        click: this.context.createInvokeHandler('editor.lineHeight')
      })]).render();
    });
    this.context.memo('button.table', () => {
      return this.ui.buttonGroup([this.button({
        className: 'dropdown-toggle',
        contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.table), this.options),
        tooltip: this.lang.table.table,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdown({
        title: this.lang.table.table,
        className: 'note-table',
        items: ['<div class="note-dimension-picker">', '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>', '<div class="note-dimension-picker-highlighted"/>', '<div class="note-dimension-picker-unhighlighted"/>', '</div>', '<div class="note-dimension-display">1 x 1</div>'].join('')
      })], {
        callback: $node => {
          const $catcher = $node.find('.note-dimension-picker-mousecatcher');
          $catcher.css({
            width: this.options.insertTableMaxSize.col + 'em',
            height: this.options.insertTableMaxSize.row + 'em'
          }).mousedown(this.context.createInvokeHandler('editor.insertTable')).on('mousemove', this.tableMoveHandler.bind(this));
        }
      }).render();
    });
    this.context.memo('button.link', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.link),
        tooltip: this.lang.link.link + this.representShortcut('linkDialog.show'),
        click: this.context.createInvokeHandler('linkDialog.show')
      }).render();
    });
    this.context.memo('button.picture', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.picture),
        tooltip: this.lang.image.image,
        click: this.context.createInvokeHandler('imageDialog.show')
      }).render();
    });
    this.context.memo('button.video', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.video),
        tooltip: this.lang.video.video,
        click: this.context.createInvokeHandler('videoDialog.show')
      }).render();
    });
    this.context.memo('button.hr', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.minus),
        tooltip: this.lang.hr.insert + this.representShortcut('insertHorizontalRule'),
        click: this.context.createInvokeHandler('editor.insertHorizontalRule')
      }).render();
    });
    this.context.memo('button.fullscreen', () => {
      return this.button({
        className: 'btn-fullscreen',
        contents: this.ui.icon(this.options.icons.arrowsAlt),
        tooltip: this.lang.options.fullscreen,
        click: this.context.createInvokeHandler('fullscreen.toggle')
      }).render();
    });
    this.context.memo('button.codeview', () => {
      return this.button({
        className: 'btn-codeview',
        contents: this.ui.icon(this.options.icons.code),
        tooltip: this.lang.options.codeview,
        click: this.context.createInvokeHandler('codeview.toggle')
      }).render();
    });
    this.context.memo('button.redo', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.redo),
        tooltip: this.lang.history.redo + this.representShortcut('redo'),
        click: this.context.createInvokeHandler('editor.redo')
      }).render();
    });
    this.context.memo('button.undo', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.undo),
        tooltip: this.lang.history.undo + this.representShortcut('undo'),
        click: this.context.createInvokeHandler('editor.undo')
      }).render();
    });
    this.context.memo('button.help', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.question),
        tooltip: this.lang.options.help,
        click: this.context.createInvokeHandler('helpDialog.show')
      }).render();
    });
  }
  /**
   * image: [
   *   ['imageResize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
   *   ['float', ['floatLeft', 'floatRight', 'floatNone']],
   *   ['remove', ['removeMedia']],
   * ],
   */


  addImagePopoverButtons() {
    // Image Size Buttons
    this.context.memo('button.resizeFull', () => {
      return this.button({
        contents: '<span class="note-fontsize-10">100%</span>',
        tooltip: this.lang.image.resizeFull,
        click: this.context.createInvokeHandler('editor.resize', '1')
      }).render();
    });
    this.context.memo('button.resizeHalf', () => {
      return this.button({
        contents: '<span class="note-fontsize-10">50%</span>',
        tooltip: this.lang.image.resizeHalf,
        click: this.context.createInvokeHandler('editor.resize', '0.5')
      }).render();
    });
    this.context.memo('button.resizeQuarter', () => {
      return this.button({
        contents: '<span class="note-fontsize-10">25%</span>',
        tooltip: this.lang.image.resizeQuarter,
        click: this.context.createInvokeHandler('editor.resize', '0.25')
      }).render();
    });
    this.context.memo('button.resizeNone', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.rollback),
        tooltip: this.lang.image.resizeNone,
        click: this.context.createInvokeHandler('editor.resize', '0')
      }).render();
    }); // Float Buttons

    this.context.memo('button.floatLeft', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.floatLeft),
        tooltip: this.lang.image.floatLeft,
        click: this.context.createInvokeHandler('editor.floatMe', 'left')
      }).render();
    });
    this.context.memo('button.floatRight', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.floatRight),
        tooltip: this.lang.image.floatRight,
        click: this.context.createInvokeHandler('editor.floatMe', 'right')
      }).render();
    });
    this.context.memo('button.floatNone', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.rollback),
        tooltip: this.lang.image.floatNone,
        click: this.context.createInvokeHandler('editor.floatMe', 'none')
      }).render();
    }); // Remove Buttons

    this.context.memo('button.removeMedia', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.trash),
        tooltip: this.lang.image.remove,
        click: this.context.createInvokeHandler('editor.removeMedia')
      }).render();
    });
  }

  addLinkPopoverButtons() {
    this.context.memo('button.linkDialogShow', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.link),
        tooltip: this.lang.link.edit,
        click: this.context.createInvokeHandler('linkDialog.show')
      }).render();
    });
    this.context.memo('button.unlink', () => {
      return this.button({
        contents: this.ui.icon(this.options.icons.unlink),
        tooltip: this.lang.link.unlink,
        click: this.context.createInvokeHandler('editor.unlink')
      }).render();
    });
  }
  /**
   * table : [
   *  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
   *  ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
   * ],
   */


  addTablePopoverButtons() {
    this.context.memo('button.addRowUp', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.rowAbove),
        tooltip: this.lang.table.addRowAbove,
        click: this.context.createInvokeHandler('editor.addRow', 'top')
      }).render();
    });
    this.context.memo('button.addRowDown', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.rowBelow),
        tooltip: this.lang.table.addRowBelow,
        click: this.context.createInvokeHandler('editor.addRow', 'bottom')
      }).render();
    });
    this.context.memo('button.addColLeft', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.colBefore),
        tooltip: this.lang.table.addColLeft,
        click: this.context.createInvokeHandler('editor.addCol', 'left')
      }).render();
    });
    this.context.memo('button.addColRight', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.colAfter),
        tooltip: this.lang.table.addColRight,
        click: this.context.createInvokeHandler('editor.addCol', 'right')
      }).render();
    });
    this.context.memo('button.deleteRow', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.rowRemove),
        tooltip: this.lang.table.delRow,
        click: this.context.createInvokeHandler('editor.deleteRow')
      }).render();
    });
    this.context.memo('button.deleteCol', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.colRemove),
        tooltip: this.lang.table.delCol,
        click: this.context.createInvokeHandler('editor.deleteCol')
      }).render();
    });
    this.context.memo('button.deleteTable', () => {
      return this.button({
        className: 'btn-md',
        contents: this.ui.icon(this.options.icons.trash),
        tooltip: this.lang.table.delTable,
        click: this.context.createInvokeHandler('editor.deleteTable')
      }).render();
    });
  }

  build($container, groups) {
    for (let groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) {
      const group = groups[groupIdx];
      const groupName = Array.isArray(group) ? group[0] : group;
      const buttons = Array.isArray(group) ? group.length === 1 ? [group[0]] : group[1] : [group];
      const $group = this.ui.buttonGroup({
        className: 'note-' + groupName
      }).render();

      for (let idx = 0, len = buttons.length; idx < len; idx++) {
        const btn = this.context.memo('button.' + buttons[idx]);

        if (btn) {
          $group.append(typeof btn === 'function' ? btn(this.context) : btn);
        }
      }

      $group.appendTo($container);
    }
  }
  /**
   * @param {jQuery} [$container]
   */


  updateCurrentStyle($container) {
    const $cont = $container || this.$toolbar;
    const styleInfo = this.context.invoke('editor.currentStyle');
    this.updateBtnStates($cont, {
      '.note-btn-bold': () => {
        return styleInfo['font-bold'] === 'bold';
      },
      '.note-btn-italic': () => {
        return styleInfo['font-italic'] === 'italic';
      },
      '.note-btn-underline': () => {
        return styleInfo['font-underline'] === 'underline';
      },
      '.note-btn-subscript': () => {
        return styleInfo['font-subscript'] === 'subscript';
      },
      '.note-btn-superscript': () => {
        return styleInfo['font-superscript'] === 'superscript';
      },
      '.note-btn-strikethrough': () => {
        return styleInfo['font-strikethrough'] === 'strikethrough';
      }
    });

    if (styleInfo['font-family']) {
      const fontNames = styleInfo['font-family'].split(',').map(name => {
        return name.replace(/[\'\"]/g, '').replace(/\s+$/, '').replace(/^\s+/, '');
      });
      const fontName = lists.find(fontNames, this.isFontInstalled.bind(this));
      $cont.find('.dropdown-fontname a').each((idx, item) => {
        const $item = external_jQuery_default()(item); // always compare string to avoid creating another func.

        const isChecked = $item.data('value') + '' === fontName + '';
        $item.toggleClass('checked', isChecked);
      });
      $cont.find('.note-current-fontname').text(fontName).css('font-family', fontName);
    }

    if (styleInfo['font-size']) {
      const fontSize = styleInfo['font-size'];
      $cont.find('.dropdown-fontsize a').each((idx, item) => {
        const $item = external_jQuery_default()(item); // always compare with string to avoid creating another func.

        const isChecked = $item.data('value') + '' === fontSize + '';
        $item.toggleClass('checked', isChecked);
      });
      $cont.find('.note-current-fontsize').text(fontSize);
      const fontSizeUnit = styleInfo['font-size-unit'];
      $cont.find('.dropdown-fontsizeunit a').each((idx, item) => {
        const $item = external_jQuery_default()(item);
        const isChecked = $item.data('value') + '' === fontSizeUnit + '';
        $item.toggleClass('checked', isChecked);
      });
      $cont.find('.note-current-fontsizeunit').text(fontSizeUnit);
    }

    if (styleInfo['line-height']) {
      const lineHeight = styleInfo['line-height'];
      $cont.find('.dropdown-line-height li a').each((idx, item) => {
        // always compare with string to avoid creating another func.
        const isChecked = external_jQuery_default()(item).data('value') + '' === lineHeight + '';
        this.className = isChecked ? 'checked' : '';
      });
    }
  }

  updateBtnStates($container, infos) {
    external_jQuery_default.a.each(infos, (selector, pred) => {
      this.ui.toggleBtnActive($container.find(selector), pred());
    });
  }

  tableMoveHandler(event) {
    const PX_PER_EM = 18;
    const $picker = external_jQuery_default()(event.target.parentNode); // target is mousecatcher

    const $dimensionDisplay = $picker.next();
    const $catcher = $picker.find('.note-dimension-picker-mousecatcher');
    const $highlighted = $picker.find('.note-dimension-picker-highlighted');
    const $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
    let posOffset; // HTML5 with jQuery - e.offsetX is undefined in Firefox

    if (event.offsetX === undefined) {
      const posCatcher = external_jQuery_default()(event.target).offset();
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

    const dim = {
      c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
      r: Math.ceil(posOffset.y / PX_PER_EM) || 1
    };
    $highlighted.css({
      width: dim.c + 'em',
      height: dim.r + 'em'
    });
    $catcher.data('value', dim.c + 'x' + dim.r);

    if (dim.c > 3 && dim.c < this.options.insertTableMaxSize.col) {
      $unhighlighted.css({
        width: dim.c + 1 + 'em'
      });
    }

    if (dim.r > 3 && dim.r < this.options.insertTableMaxSize.row) {
      $unhighlighted.css({
        height: dim.r + 1 + 'em'
      });
    }

    $dimensionDisplay.html(dim.c + ' x ' + dim.r);
  }

}
// CONCATENATED MODULE: ./src/js/base/module/Toolbar.js

class Toolbar_Toolbar {
  constructor(context) {
    this.context = context;
    this.$window = external_jQuery_default()(window);
    this.$document = external_jQuery_default()(document);
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$statusbar = context.layoutInfo.statusbar;
    this.options = context.options;
    this.isFollowing = false;
    this.followScroll = this.followScroll.bind(this);
  }

  shouldInitialize() {
    return !this.options.airMode;
  }

  initialize() {
    this.options.toolbar = this.options.toolbar || [];

    if (!this.options.toolbar.length) {
      this.$toolbar.hide();
    } else {
      this.context.invoke('buttons.build', this.$toolbar, this.options.toolbar);
    }

    if (this.options.toolbarContainer) {
      this.$toolbar.appendTo(this.options.toolbarContainer);
    }

    this.changeContainer(false);
    this.$note.on('summernote.keyup summernote.mouseup summernote.change', () => {
      this.context.invoke('buttons.updateCurrentStyle');
    });
    this.context.invoke('buttons.updateCurrentStyle');

    if (this.options.followingToolbar) {
      this.$window.on('scroll resize', this.followScroll);
    }
  }

  destroy() {
    this.$toolbar.children().remove();

    if (this.options.followingToolbar) {
      this.$window.off('scroll resize', this.followScroll);
    }
  }

  followScroll() {
    if (this.$editor.hasClass('fullscreen')) {
      return false;
    }

    const editorHeight = this.$editor.outerHeight();
    const editorWidth = this.$editor.width();
    const toolbarHeight = this.$toolbar.height();
    const statusbarHeight = this.$statusbar.height(); // check if the web app is currently using another static bar

    let otherBarHeight = 0;

    if (this.options.otherStaticBar) {
      otherBarHeight = external_jQuery_default()(this.options.otherStaticBar).outerHeight();
    }

    const currentOffset = this.$document.scrollTop();
    const editorOffsetTop = this.$editor.offset().top;
    const editorOffsetBottom = editorOffsetTop + editorHeight;
    const activateOffset = editorOffsetTop - otherBarHeight;
    const deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight - statusbarHeight;

    if (!this.isFollowing && currentOffset > activateOffset && currentOffset < deactivateOffsetBottom - toolbarHeight) {
      this.isFollowing = true;
      this.$toolbar.css({
        position: 'fixed',
        top: otherBarHeight,
        width: editorWidth,
        zIndex: 1000
      });
      this.$editable.css({
        marginTop: this.$toolbar.height() + 5
      });
    } else if (this.isFollowing && (currentOffset < activateOffset || currentOffset > deactivateOffsetBottom)) {
      this.isFollowing = false;
      this.$toolbar.css({
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: 'auto'
      });
      this.$editable.css({
        marginTop: ''
      });
    }
  }

  changeContainer(isFullscreen) {
    if (isFullscreen) {
      this.$toolbar.prependTo(this.$editor);
    } else {
      if (this.options.toolbarContainer) {
        this.$toolbar.appendTo(this.options.toolbarContainer);
      }
    }

    if (this.options.followingToolbar) {
      this.followScroll();
    }
  }

  updateFullscreen(isFullscreen) {
    this.ui.toggleBtnActive(this.$toolbar.find('.btn-fullscreen'), isFullscreen);
    this.changeContainer(isFullscreen);
  }

  updateCodeview(isCodeview) {
    this.ui.toggleBtnActive(this.$toolbar.find('.btn-codeview'), isCodeview);

    if (isCodeview) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  activate(isIncludeCodeview) {
    let $btn = this.$toolbar.find('button');

    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
    }

    this.ui.toggleBtn($btn, true);
  }

  deactivate(isIncludeCodeview) {
    let $btn = this.$toolbar.find('button');

    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
    }

    this.ui.toggleBtn($btn, false);
  }

}
// CONCATENATED MODULE: ./src/js/base/module/LinkDialog.js




class LinkDialog_LinkDialog {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$body = external_jQuery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
    context.memo('help.linkDialog.show', this.options.langInfo.help['linkDialog.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = ['<div class="form-group note-form-group">', `<label for="note-dialog-link-txt-${this.options.id}" class="note-form-label">${this.lang.link.textToDisplay}</label>`, `<input id="note-dialog-link-txt-${this.options.id}" class="note-link-text form-control note-form-control note-input" type="text"/>`, '</div>', '<div class="form-group note-form-group">', `<label for="note-dialog-link-url-${this.options.id}" class="note-form-label">${this.lang.link.url}</label>`, `<input id="note-dialog-link-url-${this.options.id}" class="note-link-url form-control note-form-control note-input" type="text" value="http://"/>`, '</div>', !this.options.disableLinkTarget ? external_jQuery_default()('<div/>').append(this.ui.checkbox({
      className: 'sn-checkbox-open-in-new-window',
      text: this.lang.link.openInNewWindow,
      checked: true
    }).render()).html() : '', external_jQuery_default()('<div/>').append(this.ui.checkbox({
      className: 'sn-checkbox-use-protocol',
      text: this.lang.link.useProtocol,
      checked: true
    }).render()).html()].join('');
    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-link-btn';
    const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.link.insert}" disabled>`;
    this.$dialog = this.ui.dialog({
      className: 'link-dialog',
      title: this.lang.link.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', event => {
      if (event.keyCode === core_key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }
  /**
   * toggle update button
   */


  toggleLinkBtn($linkBtn, $linkText, $linkUrl) {
    this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
  }
  /**
   * Show link dialog and set event handlers on dialog controls.
   *
   * @param {Object} linkInfo
   * @return {Promise}
   */


  showLinkDialog(linkInfo) {
    return external_jQuery_default.a.Deferred(deferred => {
      const $linkText = this.$dialog.find('.note-link-text');
      const $linkUrl = this.$dialog.find('.note-link-url');
      const $linkBtn = this.$dialog.find('.note-link-btn');
      const $openInNewWindow = this.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]');
      const $useProtocol = this.$dialog.find('.sn-checkbox-use-protocol input[type=checkbox]');
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown'); // If no url was given and given text is valid URL then copy that into URL Field

        if (!linkInfo.url && func.isValidUrl(linkInfo.text)) {
          linkInfo.url = linkInfo.text;
        }

        $linkText.on('input paste propertychange', () => {
          // If linktext was modified by input events,
          // cloning text from linkUrl will be stopped.
          linkInfo.text = $linkText.val();
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.text);
        $linkUrl.on('input paste propertychange', () => {
          // Display same text on `Text to display` as default
          // when linktext has no text
          if (!linkInfo.text) {
            $linkText.val($linkUrl.val());
          }

          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.url);

        if (!env.isSupportTouch) {
          $linkUrl.trigger('focus');
        }

        this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        this.bindEnterKey($linkUrl, $linkBtn);
        this.bindEnterKey($linkText, $linkBtn);
        const isNewWindowChecked = linkInfo.isNewWindow !== undefined ? linkInfo.isNewWindow : this.context.options.linkTargetBlank;
        $openInNewWindow.prop('checked', isNewWindowChecked);
        const useProtocolChecked = linkInfo.url ? false : this.context.options.useProtocol;
        $useProtocol.prop('checked', useProtocolChecked);
        $linkBtn.one('click', event => {
          event.preventDefault();
          deferred.resolve({
            range: linkInfo.range,
            url: $linkUrl.val(),
            text: $linkText.val(),
            isNewWindow: $openInNewWindow.is(':checked'),
            checkProtocol: $useProtocol.is(':checked')
          });
          this.ui.hideDialog(this.$dialog);
        });
      });
      this.ui.onDialogHidden(this.$dialog, () => {
        // detach events
        $linkText.off();
        $linkUrl.off();
        $linkBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });
      this.ui.showDialog(this.$dialog);
    }).promise();
  }
  /**
   * @param {Object} layoutInfo
   */


  show() {
    const linkInfo = this.context.invoke('editor.getLinkInfo');
    this.context.invoke('editor.saveRange');
    this.showLinkDialog(linkInfo).then(linkInfo => {
      this.context.invoke('editor.restoreRange');
      this.context.invoke('editor.createLink', linkInfo);
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }

}
// CONCATENATED MODULE: ./src/js/base/module/LinkPopover.js



class LinkPopover_LinkPopover {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.options = context.options;
    this.target = context.options.container;
    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': () => {
        this.update();
      },
      'summernote.disable summernote.dialog.shown summernote.blur': () => {
        this.hide();
      }
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.link);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-link-popover',
      callback: $node => {
        const $content = $node.find('.popover-content,.note-popover-content');
        $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
      }
    }).render().appendTo(this.target);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.link);
    this.$popover.on('mousedown', e => {
      e.preventDefault();
    });
  }

  destroy() {
    this.$popover.remove();
  }

  update() {
    // Prevent focusing on editable when invoke('code') is executed
    if (!this.context.invoke('editor.hasFocus')) {
      this.hide();
      return;
    }

    const rng = this.context.invoke('editor.getLastRange');

    if (rng.isCollapsed() && rng.isOnAnchor()) {
      const anchor = dom.ancestor(rng.sc, dom.isAnchor);
      const href = external_jQuery_default()(anchor).attr('href');
      this.$popover.find('a').attr('href', href).html(href);
      const pos = dom.posFromPlaceholder(anchor);
      const targetOffset = external_jQuery_default()(this.target).offset();
      pos.top -= targetOffset.top;
      pos.left -= targetOffset.left;
      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
      });
    } else {
      this.hide();
    }
  }

  hide() {
    this.$popover.hide();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/ImageDialog.js



class ImageDialog_ImageDialog {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$body = external_jQuery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    let imageLimitation = '';

    if (this.options.maximumImageFileSize) {
      const unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
      const readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
      imageLimitation = `<small>${this.lang.image.maximumFileSize + ' : ' + readableSize}</small>`;
    }

    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = ['<div class="form-group note-form-group note-group-select-from-files">', '<label for="note-dialog-image-file-' + this.options.id + '" class="note-form-label">' + this.lang.image.selectFromFiles + '</label>', '<input id="note-dialog-image-file-' + this.options.id + '" class="note-image-input form-control-file note-form-control note-input" ', ' type="file" name="files" accept="image/*" multiple="multiple"/>', imageLimitation, '</div>', '<div class="form-group note-group-image-url">', '<label for="note-dialog-image-url-' + this.options.id + '" class="note-form-label">' + this.lang.image.url + '</label>', '<input id="note-dialog-image-url-' + this.options.id + '" class="note-image-url form-control note-form-control note-input" type="text"/>', '</div>'].join('');
    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-image-btn';
    const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.image.insert}" disabled>`;
    this.$dialog = this.ui.dialog({
      title: this.lang.image.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', event => {
      if (event.keyCode === core_key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  show() {
    this.context.invoke('editor.saveRange');
    this.showImageDialog().then(data => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      if (typeof data === 'string') {
        // image url
        // If onImageLinkInsert set,
        if (this.options.callbacks.onImageLinkInsert) {
          this.context.triggerEvent('image.link.insert', data);
        } else {
          this.context.invoke('editor.insertImage', data);
        }
      } else {
        // array of files
        this.context.invoke('editor.insertImagesOrCallback', data);
      }
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
  /**
   * show image dialog
   *
   * @param {jQuery} $dialog
   * @return {Promise}
   */


  showImageDialog() {
    return external_jQuery_default.a.Deferred(deferred => {
      const $imageInput = this.$dialog.find('.note-image-input');
      const $imageUrl = this.$dialog.find('.note-image-url');
      const $imageBtn = this.$dialog.find('.note-image-btn');
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown'); // Cloning imageInput to clear element.

        $imageInput.replaceWith($imageInput.clone().on('change', event => {
          deferred.resolve(event.target.files || event.target.value);
        }).val(''));
        $imageUrl.on('input paste propertychange', () => {
          this.ui.toggleBtn($imageBtn, $imageUrl.val());
        }).val('');

        if (!env.isSupportTouch) {
          $imageUrl.trigger('focus');
        }

        $imageBtn.click(event => {
          event.preventDefault();
          deferred.resolve($imageUrl.val());
        });
        this.bindEnterKey($imageUrl, $imageBtn);
      });
      this.ui.onDialogHidden(this.$dialog, () => {
        $imageInput.off();
        $imageUrl.off();
        $imageBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });
      this.ui.showDialog(this.$dialog);
    });
  }

}
// CONCATENATED MODULE: ./src/js/base/module/ImagePopover.js



/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */

class ImagePopover_ImagePopover {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.editable = context.layoutInfo.editable[0];
    this.options = context.options;
    this.events = {
      'summernote.disable summernote.blur': () => {
        this.hide();
      }
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.image);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-image-popover'
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.image);
    this.$popover.on('mousedown', e => {
      e.preventDefault();
    });
  }

  destroy() {
    this.$popover.remove();
  }

  update(target, event) {
    if (dom.isImg(target)) {
      const position = external_jQuery_default()(target).offset();
      const editingOffset = external_jQuery_default()(this.context.layoutInfo.editingArea).offset();
      const pos = {
        left: position.left - editingOffset.left,
        top: position.top - editingOffset.top
      };
      this.$popover.css({
        display: 'block',
        left: this.options.popatmouse ? event.pageX - 20 : pos.left,
        top: this.options.popatmouse ? event.pageY : pos.top
      });
    } else {
      this.hide();
    }
  }

  hide() {
    this.$popover.hide();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/TablePopover.js




class TablePopover_TablePopover {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.mousedown': (we, e) => {
        this.update(e.target);
      },
      'summernote.keyup summernote.scroll summernote.change': () => {
        this.update();
      },
      'summernote.disable summernote.blur': () => {
        this.hide();
      }
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.table);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-table-popover'
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.table); // [workaround] Disable Firefox's default table editor

    if (env.isFF) {
      document.execCommand('enableInlineTableEditing', false, false);
    }

    this.$popover.on('mousedown', e => {
      e.preventDefault();
    });
  }

  destroy() {
    this.$popover.remove();
  }

  update(target) {
    if (this.context.isDisabled()) {
      return false;
    }

    const isCell = dom.isCell(target);

    if (isCell) {
      const pos = dom.posFromPlaceholder(target);
      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
      });
    } else {
      this.hide();
    }

    return isCell;
  }

  hide() {
    this.$popover.hide();
  }

}
// CONCATENATED MODULE: ./src/js/base/module/VideoDialog.js



class VideoDialog_VideoDialog {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$body = external_jQuery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = ['<div class="form-group note-form-group row-fluid">', `<label for="note-dialog-video-url-${this.options.id}" class="note-form-label">${this.lang.video.url} <small class="text-muted">${this.lang.video.providers}</small></label>`, `<input id="note-dialog-video-url-${this.options.id}" class="note-video-url form-control note-form-control note-input" type="text"/>`, '</div>'].join('');
    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-video-btn';
    const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.video.insert}" disabled>`;
    this.$dialog = this.ui.dialog({
      title: this.lang.video.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', event => {
      if (event.keyCode === core_key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  createVideoNode(url) {
    // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
    const ytRegExp = /\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w|-]{11})(?:(?:[\?&]t=)(\S+))?$/;
    const ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
    const ytMatch = url.match(ytRegExp);
    const igRegExp = /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/;
    const igMatch = url.match(igRegExp);
    const vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
    const vMatch = url.match(vRegExp);
    const vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
    const vimMatch = url.match(vimRegExp);
    const dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
    const dmMatch = url.match(dmRegExp);
    const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
    const youkuMatch = url.match(youkuRegExp);
    const qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
    const qqMatch = url.match(qqRegExp);
    const qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
    const qqMatch2 = url.match(qqRegExp2);
    const mp4RegExp = /^.+.(mp4|m4v)$/;
    const mp4Match = url.match(mp4RegExp);
    const oggRegExp = /^.+.(ogg|ogv)$/;
    const oggMatch = url.match(oggRegExp);
    const webmRegExp = /^.+.(webm)$/;
    const webmMatch = url.match(webmRegExp);
    const fbRegExp = /(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/;
    const fbMatch = url.match(fbRegExp);
    let $video;

    if (ytMatch && ytMatch[1].length === 11) {
      const youtubeId = ytMatch[1];
      var start = 0;

      if (typeof ytMatch[2] !== 'undefined') {
        const ytMatchForStart = ytMatch[2].match(ytRegExpForStart);

        if (ytMatchForStart) {
          for (var n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
            start += typeof ytMatchForStart[i + 1] !== 'undefined' ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0;
          }
        }
      }

      $video = external_jQuery_default()('<iframe>').attr('frameborder', 0).attr('src', '//www.youtube.com/embed/' + youtubeId + (start > 0 ? '?start=' + start : '')).attr('width', '640').attr('height', '360');
    } else if (igMatch && igMatch[0].length) {
      $video = external_jQuery_default()('<iframe>').attr('frameborder', 0).attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/').attr('width', '612').attr('height', '710').attr('scrolling', 'no').attr('allowtransparency', 'true');
    } else if (vMatch && vMatch[0].length) {
      $video = external_jQuery_default()('<iframe>').attr('frameborder', 0).attr('src', vMatch[0] + '/embed/simple').attr('width', '600').attr('height', '600').attr('class', 'vine-embed');
    } else if (vimMatch && vimMatch[3].length) {
      $video = external_jQuery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('src', '//player.vimeo.com/video/' + vimMatch[3]).attr('width', '640').attr('height', '360');
    } else if (dmMatch && dmMatch[2].length) {
      $video = external_jQuery_default()('<iframe>').attr('frameborder', 0).attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2]).attr('width', '640').attr('height', '360');
    } else if (youkuMatch && youkuMatch[1].length) {
      $video = external_jQuery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('height', '498').attr('width', '510').attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
    } else if (qqMatch && qqMatch[1].length || qqMatch2 && qqMatch2[2].length) {
      const vid = qqMatch && qqMatch[1].length ? qqMatch[1] : qqMatch2[2];
      $video = external_jQuery_default()('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('height', '310').attr('width', '500').attr('src', 'https://v.qq.com/iframe/player.html?vid=' + vid + '&amp;auto=0');
    } else if (mp4Match || oggMatch || webmMatch) {
      $video = external_jQuery_default()('<video controls>').attr('src', url).attr('width', '640').attr('height', '360');
    } else if (fbMatch && fbMatch[0].length) {
      $video = external_jQuery_default()('<iframe>').attr('frameborder', 0).attr('src', 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(fbMatch[0]) + '&show_text=0&width=560').attr('width', '560').attr('height', '301').attr('scrolling', 'no').attr('allowtransparency', 'true');
    } else {
      // this is not a known video link. Now what, Cat? Now what?
      return false;
    }

    $video.addClass('note-video-clip');
    return $video[0];
  }

  show() {
    const text = this.context.invoke('editor.getSelectedText');
    this.context.invoke('editor.saveRange');
    this.showVideoDialog(text).then(url => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange'); // build node

      const $node = this.createVideoNode(url);

      if ($node) {
        // insert video node
        this.context.invoke('editor.insertNode', $node);
      }
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
  /**
   * show image dialog
   *
   * @param {jQuery} $dialog
   * @return {Promise}
   */


  showVideoDialog(text) {
    return external_jQuery_default.a.Deferred(deferred => {
      const $videoUrl = this.$dialog.find('.note-video-url');
      const $videoBtn = this.$dialog.find('.note-video-btn');
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');
        $videoUrl.on('input paste propertychange', () => {
          this.ui.toggleBtn($videoBtn, $videoUrl.val());
        });

        if (!env.isSupportTouch) {
          $videoUrl.trigger('focus');
        }

        $videoBtn.click(event => {
          event.preventDefault();
          deferred.resolve($videoUrl.val());
        });
        this.bindEnterKey($videoUrl, $videoBtn);
      });
      this.ui.onDialogHidden(this.$dialog, () => {
        $videoUrl.off();
        $videoBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });
      this.ui.showDialog(this.$dialog);
    });
  }

}
// CONCATENATED MODULE: ./src/js/base/module/HelpDialog.js


class HelpDialog_HelpDialog {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$body = external_jQuery_default()(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = ['<p class="text-center">', '<a href="http://summernote.org/" target="_blank">Summernote 0.8.14</a> · ', '<a href="https://github.com/summernote/summernote" target="_blank">Project</a> · ', '<a href="https://github.com/summernote/summernote/issues" target="_blank">Issues</a>', '</p>'].join('');
    this.$dialog = this.ui.dialog({
      title: this.lang.options.help,
      fade: this.options.dialogsFade,
      body: this.createShortcutList(),
      footer: body,
      callback: $node => {
        $node.find('.modal-body,.note-modal-body').css({
          'max-height': 300,
          'overflow': 'scroll'
        });
      }
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  createShortcutList() {
    const keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
    return Object.keys(keyMap).map(key => {
      const command = keyMap[key];
      const $row = external_jQuery_default()('<div><div class="help-list-item"/></div>');
      $row.append(external_jQuery_default()('<label><kbd>' + key + '</kdb></label>').css({
        'width': 180,
        'margin-right': 10
      })).append(external_jQuery_default()('<span/>').html(this.context.memo('help.' + command) || command));
      return $row.html();
    }).join('');
  }
  /**
   * show help dialog
   *
   * @return {Promise}
   */


  showHelpDialog() {
    return external_jQuery_default.a.Deferred(deferred => {
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');
        deferred.resolve();
      });
      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  show() {
    this.context.invoke('editor.saveRange');
    this.showHelpDialog().then(() => {
      this.context.invoke('editor.restoreRange');
    });
  }

}
// CONCATENATED MODULE: ./src/js/base/module/AirPopover.js



const AIR_MODE_POPOVER_X_OFFSET = 20;
class AirPopover_AirPopover {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.options = context.options;
    this.hidable = true;
    this.events = {
      'summernote.keyup summernote.mouseup summernote.scroll': () => {
        if (this.options.editing) {
          this.update();
        }
      },
      'summernote.disable summernote.change summernote.dialog.shown summernote.blur': () => {
        this.hide();
      },
      'summernote.focusout': (we, e) => {
        if (!this.$popover.is(':active,:focus')) {
          this.hide();
        }
      }
    };
  }

  shouldInitialize() {
    return this.options.airMode && !lists.isEmpty(this.options.popover.air);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-air-popover'
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.air); // disable hiding this popover preemptively by 'summernote.blur' event.

    this.$popover.on('mousedown', () => {
      this.hidable = false;
    }); // (re-)enable hiding after 'summernote.blur' has been handled (aka. ignored).

    this.$popover.on('mouseup', () => {
      this.hidable = true;
    });
  }

  destroy() {
    this.$popover.remove();
  }

  update() {
    const styleInfo = this.context.invoke('editor.currentStyle');

    if (styleInfo.range && !styleInfo.range.isCollapsed()) {
      const rect = lists.last(styleInfo.range.getClientRects());

      if (rect) {
        const bnd = func.rect2bnd(rect);
        this.$popover.css({
          display: 'block',
          left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
          top: bnd.top + bnd.height
        });
        this.context.invoke('buttons.updateCurrentStyle', this.$popover);
      }
    } else {
      this.hide();
    }
  }

  hide() {
    if (this.hidable) {
      this.$popover.hide();
    }
  }

}
// CONCATENATED MODULE: ./src/js/base/module/HintPopover.js






const POPOVER_DIST = 5;
class HintPopover_HintPopover {
  constructor(context) {
    this.context = context;
    this.ui = external_jQuery_default.a.summernote.ui;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.target = context.options.container;
    this.hint = this.options.hint || [];
    this.direction = this.options.hintDirection || 'bottom';
    this.hints = Array.isArray(this.hint) ? this.hint : [this.hint];
    this.events = {
      'summernote.keyup': (we, e) => {
        if (!e.isDefaultPrevented()) {
          this.handleKeyup(e);
        }
      },
      'summernote.keydown': (we, e) => {
        this.handleKeydown(e);
      },
      'summernote.disable summernote.dialog.shown summernote.blur': () => {
        this.hide();
      }
    };
  }

  shouldInitialize() {
    return this.hints.length > 0;
  }

  initialize() {
    this.lastWordRange = null;
    this.matchingWord = null;
    this.$popover = this.ui.popover({
      className: 'note-hint-popover',
      hideArrow: true,
      direction: ''
    }).render().appendTo(this.target);
    this.$popover.hide();
    this.$content = this.$popover.find('.popover-content,.note-popover-content');
    this.$content.on('click', '.note-hint-item', e => {
      this.$content.find('.active').removeClass('active');
      external_jQuery_default()(e.currentTarget).addClass('active');
      this.replace();
    });
    this.$popover.on('mousedown', e => {
      e.preventDefault();
    });
  }

  destroy() {
    this.$popover.remove();
  }

  selectItem($item) {
    this.$content.find('.active').removeClass('active');
    $item.addClass('active');
    this.$content[0].scrollTop = $item[0].offsetTop - this.$content.innerHeight() / 2;
  }

  moveDown() {
    const $current = this.$content.find('.note-hint-item.active');
    const $next = $current.next();

    if ($next.length) {
      this.selectItem($next);
    } else {
      let $nextGroup = $current.parent().next();

      if (!$nextGroup.length) {
        $nextGroup = this.$content.find('.note-hint-group').first();
      }

      this.selectItem($nextGroup.find('.note-hint-item').first());
    }
  }

  moveUp() {
    const $current = this.$content.find('.note-hint-item.active');
    const $prev = $current.prev();

    if ($prev.length) {
      this.selectItem($prev);
    } else {
      let $prevGroup = $current.parent().prev();

      if (!$prevGroup.length) {
        $prevGroup = this.$content.find('.note-hint-group').last();
      }

      this.selectItem($prevGroup.find('.note-hint-item').last());
    }
  }

  replace() {
    const $item = this.$content.find('.note-hint-item.active');

    if ($item.length) {
      var node = this.nodeFromItem($item); // If matchingWord length = 0 -> capture OK / open hint / but as mention capture "" (\w*)

      if (this.matchingWord !== null && this.matchingWord.length === 0) {
        this.lastWordRange.so = this.lastWordRange.eo; // Else si > 0 and normal case -> adjust range "before" for correct position of insertion
      } else if (this.matchingWord !== null && this.matchingWord.length > 0 && !this.lastWordRange.isCollapsed()) {
        let rangeCompute = this.lastWordRange.eo - this.lastWordRange.so - this.matchingWord.length;

        if (rangeCompute > 0) {
          this.lastWordRange.so += rangeCompute;
        }
      }

      this.lastWordRange.insertNode(node);

      if (this.options.hintSelect === 'next') {
        var blank = document.createTextNode('');
        external_jQuery_default()(node).after(blank);
        core_range.createFromNodeBefore(blank).select();
      } else {
        core_range.createFromNodeAfter(node).select();
      }

      this.lastWordRange = null;
      this.hide();
      this.context.invoke('editor.focus');
    }
  }

  nodeFromItem($item) {
    const hint = this.hints[$item.data('index')];
    const item = $item.data('item');
    let node = hint.content ? hint.content(item) : item;

    if (typeof node === 'string') {
      node = dom.createText(node);
    }

    return node;
  }

  createItemTemplates(hintIdx, items) {
    const hint = this.hints[hintIdx];
    return items.map((item, idx) => {
      const $item = external_jQuery_default()('<div class="note-hint-item"/>');
      $item.append(hint.template ? hint.template(item) : item + '');
      $item.data({
        'index': hintIdx,
        'item': item
      });
      return $item;
    });
  }

  handleKeydown(e) {
    if (!this.$popover.is(':visible')) {
      return;
    }

    if (e.keyCode === core_key.code.ENTER) {
      e.preventDefault();
      this.replace();
    } else if (e.keyCode === core_key.code.UP) {
      e.preventDefault();
      this.moveUp();
    } else if (e.keyCode === core_key.code.DOWN) {
      e.preventDefault();
      this.moveDown();
    }
  }

  searchKeyword(index, keyword, callback) {
    const hint = this.hints[index];

    if (hint && hint.match.test(keyword) && hint.search) {
      const matches = hint.match.exec(keyword);
      this.matchingWord = matches[0];
      hint.search(matches[1], callback);
    } else {
      callback();
    }
  }

  createGroup(idx, keyword) {
    const $group = external_jQuery_default()('<div class="note-hint-group note-hint-group-' + idx + '"/>');
    this.searchKeyword(idx, keyword, items => {
      items = items || [];

      if (items.length) {
        $group.html(this.createItemTemplates(idx, items));
        this.show();
      }
    });
    return $group;
  }

  handleKeyup(e) {
    if (!lists.contains([core_key.code.ENTER, core_key.code.UP, core_key.code.DOWN], e.keyCode)) {
      let range = this.context.invoke('editor.getLastRange');
      let wordRange, keyword;

      if (this.options.hintMode === 'words') {
        wordRange = range.getWordsRange(range);
        keyword = wordRange.toString();
        this.hints.forEach(hint => {
          if (hint.match.test(keyword)) {
            wordRange = range.getWordsMatchRange(hint.match);
            return false;
          }
        });

        if (!wordRange) {
          this.hide();
          return;
        }

        keyword = wordRange.toString();
      } else {
        wordRange = range.getWordRange();
        keyword = wordRange.toString();
      }

      if (this.hints.length && keyword) {
        this.$content.empty();
        const bnd = func.rect2bnd(lists.last(wordRange.getClientRects()));
        const targetOffset = external_jQuery_default()(this.target).offset();

        if (bnd) {
          bnd.top -= targetOffset.top;
          bnd.left -= targetOffset.left;
          this.$popover.hide();
          this.lastWordRange = wordRange;
          this.hints.forEach((hint, idx) => {
            if (hint.match.test(keyword)) {
              this.createGroup(idx, keyword).appendTo(this.$content);
            }
          }); // select first .note-hint-item

          this.$content.find('.note-hint-item:first').addClass('active'); // set position for popover after group is created

          if (this.direction === 'top') {
            this.$popover.css({
              left: bnd.left,
              top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST
            });
          } else {
            this.$popover.css({
              left: bnd.left,
              top: bnd.top + bnd.height + POPOVER_DIST
            });
          }
        }
      } else {
        this.hide();
      }
    }
  }

  show() {
    this.$popover.show();
  }

  hide() {
    this.$popover.hide();
  }

}
// CONCATENATED MODULE: ./src/js/base/settings.js




























external_jQuery_default.a.summernote = external_jQuery_default.a.extend(external_jQuery_default.a.summernote, {
  version: '0.8.14',
  plugins: {},
  dom: dom,
  range: core_range,
  lists: lists,
  options: {
    langInfo: external_jQuery_default.a.summernote.lang['en-US'],
    editing: true,
    modules: {
      'editor': Editor_Editor,
      'clipboard': Clipboard_Clipboard,
      'dropzone': Dropzone_Dropzone,
      'codeview': Codeview_CodeView,
      'statusbar': Statusbar_Statusbar,
      'fullscreen': Fullscreen_Fullscreen,
      'handle': Handle_Handle,
      // FIXME: HintPopover must be front of autolink
      //  - Script error about range when Enter key is pressed on hint popover
      'hintPopover': HintPopover_HintPopover,
      'autoLink': AutoLink_AutoLink,
      'autoSync': AutoSync_AutoSync,
      'autoReplace': AutoReplace_AutoReplace,
      'placeholder': Placeholder_Placeholder,
      'buttons': Buttons_Buttons,
      'toolbar': Toolbar_Toolbar,
      'linkDialog': LinkDialog_LinkDialog,
      'linkPopover': LinkPopover_LinkPopover,
      'imageDialog': ImageDialog_ImageDialog,
      'imagePopover': ImagePopover_ImagePopover,
      'tablePopover': TablePopover_TablePopover,
      'videoDialog': VideoDialog_VideoDialog,
      'helpDialog': HelpDialog_HelpDialog,
      'airPopover': AirPopover_AirPopover
    },
    buttons: {},
    lang: 'en-US',
    followingToolbar: false,
    toolbarPosition: 'top',
    otherStaticBar: '',
    // toolbar
    toolbar: [['style', ['style']], ['font', ['bold', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture', 'video']], ['view', ['fullscreen', 'codeview', 'help']]],
    // popover
    popatmouse: true,
    popover: {
      image: [['resize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']], ['float', ['floatLeft', 'floatRight', 'floatNone']], ['remove', ['removeMedia']]],
      link: [['link', ['linkDialogShow', 'unlink']]],
      table: [['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']], ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]],
      air: [['color', ['color']], ['font', ['bold', 'underline', 'clear']], ['para', ['ul', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['fullscreen', 'codeview']]]
    },
    // air mode: inline editor
    airMode: false,
    width: null,
    height: null,
    linkTargetBlank: true,
    useProtocol: true,
    defaultProtocol: 'http://',
    focus: false,
    tabDisabled: false,
    tabSize: 4,
    styleWithSpan: true,
    shortcuts: true,
    textareaAutoSync: true,
    tooltip: 'auto',
    container: null,
    maxTextLength: 0,
    blockquoteBreakingLevel: 2,
    spellCheck: true,
    disableGrammar: false,
    placeholder: null,
    inheritPlaceholder: false,
    // TODO: need to be documented
    hintMode: 'word',
    hintSelect: 'after',
    hintDirection: 'bottom',
    styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande', 'Tahoma', 'Times New Roman', 'Verdana'],
    fontNamesIgnoreCheck: [],
    addDefaultFonts: true,
    fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
    fontSizeUnits: ['px', 'pt'],
    // pallete colors(n x n)
    colors: [['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'], ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'], ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'], ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'], ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'], ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'], ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'], ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']],
    // http://chir.ag/projects/name-that-color/
    colorsName: [['Black', 'Tundora', 'Dove Gray', 'Star Dust', 'Pale Slate', 'Gallery', 'Alabaster', 'White'], ['Red', 'Orange Peel', 'Yellow', 'Green', 'Cyan', 'Blue', 'Electric Violet', 'Magenta'], ['Azalea', 'Karry', 'Egg White', 'Zanah', 'Botticelli', 'Tropical Blue', 'Mischka', 'Twilight'], ['Tonys Pink', 'Peach Orange', 'Cream Brulee', 'Sprout', 'Casper', 'Perano', 'Cold Purple', 'Careys Pink'], ['Mandy', 'Rajah', 'Dandelion', 'Olivine', 'Gulf Stream', 'Viking', 'Blue Marguerite', 'Puce'], ['Guardsman Red', 'Fire Bush', 'Golden Dream', 'Chelsea Cucumber', 'Smalt Blue', 'Boston Blue', 'Butterfly Bush', 'Cadillac'], ['Sangria', 'Mai Tai', 'Buddha Gold', 'Forest Green', 'Eden', 'Venice Blue', 'Meteorite', 'Claret'], ['Rosewood', 'Cinnamon', 'Olive', 'Parsley', 'Tiber', 'Midnight Blue', 'Valentino', 'Loulou']],
    colorButton: {
      foreColor: '#000000',
      backColor: '#FFFF00'
    },
    lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
    tableClassName: 'table table-bordered',
    insertTableMaxSize: {
      col: 10,
      row: 10
    },
    // By default, dialogs are attached in container.
    dialogsInBody: false,
    dialogsFade: false,
    maximumImageFileSize: null,
    callbacks: {
      onBeforeCommand: null,
      onBlur: null,
      onBlurCodeview: null,
      onChange: null,
      onChangeCodeview: null,
      onDialogShown: null,
      onEnter: null,
      onFocus: null,
      onImageLinkInsert: null,
      onImageUpload: null,
      onImageUploadError: null,
      onInit: null,
      onKeydown: null,
      onKeyup: null,
      onMousedown: null,
      onMouseup: null,
      onPaste: null,
      onScroll: null
    },
    codemirror: {
      mode: 'text/html',
      htmlMode: true,
      lineNumbers: true
    },
    codeviewFilter: false,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi,
    codeviewIframeFilter: true,
    codeviewIframeWhitelistSrc: [],
    codeviewIframeWhitelistSrcBase: ['www.youtube.com', 'www.youtube-nocookie.com', 'www.facebook.com', 'vine.co', 'instagram.com', 'player.vimeo.com', 'www.dailymotion.com', 'player.youku.com', 'v.qq.com'],
    keyMap: {
      pc: {
        'ENTER': 'insertParagraph',
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
        'CTRL+ENTER': 'insertHorizontalRule',
        'CTRL+K': 'linkDialog.show'
      },
      mac: {
        'ENTER': 'insertParagraph',
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
        'CMD+ENTER': 'insertHorizontalRule',
        'CMD+K': 'linkDialog.show'
      }
    },
    icons: {
      'align': 'note-icon-align',
      'alignCenter': 'note-icon-align-center',
      'alignJustify': 'note-icon-align-justify',
      'alignLeft': 'note-icon-align-left',
      'alignRight': 'note-icon-align-right',
      'rowBelow': 'note-icon-row-below',
      'colBefore': 'note-icon-col-before',
      'colAfter': 'note-icon-col-after',
      'rowAbove': 'note-icon-row-above',
      'rowRemove': 'note-icon-row-remove',
      'colRemove': 'note-icon-col-remove',
      'indent': 'note-icon-align-indent',
      'outdent': 'note-icon-align-outdent',
      'arrowsAlt': 'note-icon-arrows-alt',
      'bold': 'note-icon-bold',
      'caret': 'note-icon-caret',
      'circle': 'note-icon-circle',
      'close': 'note-icon-close',
      'code': 'note-icon-code',
      'eraser': 'note-icon-eraser',
      'floatLeft': 'note-icon-float-left',
      'floatRight': 'note-icon-float-right',
      'font': 'note-icon-font',
      'frame': 'note-icon-frame',
      'italic': 'note-icon-italic',
      'link': 'note-icon-link',
      'unlink': 'note-icon-chain-broken',
      'magic': 'note-icon-magic',
      'menuCheck': 'note-icon-menu-check',
      'minus': 'note-icon-minus',
      'orderedlist': 'note-icon-orderedlist',
      'pencil': 'note-icon-pencil',
      'picture': 'note-icon-picture',
      'question': 'note-icon-question',
      'redo': 'note-icon-redo',
      'rollback': 'note-icon-rollback',
      'square': 'note-icon-square',
      'strikethrough': 'note-icon-strikethrough',
      'subscript': 'note-icon-subscript',
      'superscript': 'note-icon-superscript',
      'table': 'note-icon-table',
      'textHeight': 'note-icon-text-height',
      'trash': 'note-icon-trash',
      'underline': 'note-icon-underline',
      'undo': 'note-icon-undo',
      'unorderedlist': 'note-icon-unorderedlist',
      'video': 'note-icon-video'
    }
  }
});

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_);

// EXTERNAL MODULE: ./src/js/base/renderer.js
var renderer = __webpack_require__(1);

// CONCATENATED MODULE: ./src/js/bs4/ui.js


const editor = renderer["a" /* default */].create('<div class="note-editor note-frame card"/>');
const toolbar = renderer["a" /* default */].create('<div class="note-toolbar card-header" role="toolbar"></div>');
const editingArea = renderer["a" /* default */].create('<div class="note-editing-area"/>');
const codable = renderer["a" /* default */].create('<textarea class="note-codable" aria-multiline="true"/>');
const editable = renderer["a" /* default */].create('<div class="note-editable card-block" contentEditable="true" role="textbox" aria-multiline="true"/>');
const statusbar = renderer["a" /* default */].create(['<output class="note-status-output" role="status" aria-live="polite"/>', '<div class="note-statusbar" role="status">', '<output class="note-status-output" aria-live="polite"></output>', '<div class="note-resizebar" aria-label="Resize">', '<div class="note-icon-bar"/>', '<div class="note-icon-bar"/>', '<div class="note-icon-bar"/>', '</div>', '</div>'].join(''));
const airEditor = renderer["a" /* default */].create('<div class="note-editor note-airframe"/>');
const airEditable = renderer["a" /* default */].create(['<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"/>', '<output class="note-status-output" role="status" aria-live="polite"/>'].join(''));
const buttonGroup = renderer["a" /* default */].create('<div class="note-btn-group btn-group">');
const dropdown = renderer["a" /* default */].create('<div class="note-dropdown-menu dropdown-menu" role="list">', function ($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function (item) {
    const value = typeof item === 'string' ? item : item.value || '';
    const content = options.template ? options.template(item) : item;
    const option = typeof item === 'object' ? item.option : undefined;
    const dataValue = 'data-value="' + value + '"';
    const dataOption = option !== undefined ? ' data-option="' + option + '"' : '';
    return '<a class="dropdown-item" href="#" ' + (dataValue + dataOption) + ' role="listitem" aria-label="' + value + '">' + content + '</a>';
  }).join('') : options.items;
  $node.html(markup).attr({
    'aria-label': options.title
  });
});

const dropdownButtonContents = function (contents) {
  return contents;
};

const dropdownCheck = renderer["a" /* default */].create('<div class="note-dropdown-menu dropdown-menu note-check" role="list">', function ($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function (item) {
    const value = typeof item === 'string' ? item : item.value || '';
    const content = options.template ? options.template(item) : item;
    return '<a class="dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '">' + icon(options.checkClassName) + ' ' + content + '</a>';
  }).join('') : options.items;
  $node.html(markup).attr({
    'aria-label': options.title
  });
});
const palette = renderer["a" /* default */].create('<div class="note-color-palette"/>', function ($node, options) {
  const contents = [];

  for (let row = 0, rowSize = options.colors.length; row < rowSize; row++) {
    const eventName = options.eventName;
    const colors = options.colors[row];
    const colorsName = options.colorsName[row];
    const buttons = [];

    for (let col = 0, colSize = colors.length; col < colSize; col++) {
      const color = colors[col];
      const colorName = colorsName[col];
      buttons.push(['<button type="button" class="note-color-btn"', 'style="background-color:', color, '" ', 'data-event="', eventName, '" ', 'data-value="', color, '" ', 'title="', colorName, '" ', 'aria-label="', colorName, '" ', 'data-toggle="button" tabindex="-1"></button>'].join(''));
    }

    contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
  }

  $node.html(contents.join(''));

  if (options.tooltip) {
    $node.find('.note-color-btn').tooltip({
      container: options.container,
      trigger: 'hover',
      placement: 'bottom'
    });
  }
});
const dialog = renderer["a" /* default */].create('<div class="modal note-modal" aria-hidden="false" tabindex="-1" role="dialog"/>', function ($node, options) {
  if (options.fade) {
    $node.addClass('fade');
  }

  $node.attr({
    'aria-label': options.title
  });
  $node.html(['<div class="modal-dialog">', '<div class="modal-content">', options.title ? '<div class="modal-header">' + '<h4 class="modal-title">' + options.title + '</h4>' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</button>' + '</div>' : '', '<div class="modal-body">' + options.body + '</div>', options.footer ? '<div class="modal-footer">' + options.footer + '</div>' : '', '</div>', '</div>'].join(''));
});
const popover = renderer["a" /* default */].create(['<div class="note-popover popover in">', '<div class="arrow"/>', '<div class="popover-content note-children-container"/>', '</div>'].join(''), function ($node, options) {
  const direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';
  $node.addClass(direction);

  if (options.hideArrow) {
    $node.find('.arrow').hide();
  }
});
const ui_checkbox = renderer["a" /* default */].create('<div class="form-check"></div>', function ($node, options) {
  $node.html(['<label class="form-check-label"' + (options.id ? ' for="note-' + options.id + '"' : '') + '>', '<input type="checkbox" class="form-check-input"' + (options.id ? ' id="note-' + options.id + '"' : ''), options.checked ? ' checked' : '', ' aria-label="' + (options.text ? options.text : '') + '"', ' aria-checked="' + (options.checked ? 'true' : 'false') + '"/>', ' ' + (options.text ? options.text : '') + '</label>'].join(''));
});

const icon = function (iconClassName, tagName) {
  tagName = tagName || 'i';
  return '<' + tagName + ' class="' + iconClassName + '"/>';
};

const ui = {
  editor: editor,
  toolbar: toolbar,
  editingArea: editingArea,
  codable: codable,
  editable: editable,
  statusbar: statusbar,
  airEditor: airEditor,
  airEditable: airEditable,
  buttonGroup: buttonGroup,
  dropdown: dropdown,
  dropdownButtonContents: dropdownButtonContents,
  dropdownCheck: dropdownCheck,
  palette: palette,
  dialog: dialog,
  popover: popover,
  icon: icon,
  checkbox: ui_checkbox,
  options: {},
  button: function ($node, options) {
    return renderer["a" /* default */].create('<button type="button" class="note-btn btn btn-light btn-sm" tabindex="-1">', function ($node, options) {
      if (options && options.tooltip) {
        $node.attr({
          title: options.tooltip,
          'aria-label': options.tooltip
        }).tooltip({
          container: options.container,
          trigger: 'hover',
          placement: 'bottom'
        }).on('click', e => {
          external_jQuery_default()(e.currentTarget).tooltip('hide');
        });
      }
    })($node, options);
  },
  toggleBtn: function ($btn, isEnable) {
    $btn.toggleClass('disabled', !isEnable);
    $btn.attr('disabled', !isEnable);
  },
  toggleBtnActive: function ($btn, isActive) {
    $btn.toggleClass('active', isActive);
  },
  onDialogShown: function ($dialog, handler) {
    $dialog.one('shown.bs.modal', handler);
  },
  onDialogHidden: function ($dialog, handler) {
    $dialog.one('hidden.bs.modal', handler);
  },
  showDialog: function ($dialog) {
    $dialog.modal('show');
  },
  hideDialog: function ($dialog) {
    $dialog.modal('hide');
  },
  createLayout: function ($note, options) {
    const $editor = (options.airMode ? ui.airEditor([ui.editingArea([ui.codable(), ui.airEditable()])]) : options.toolbarPosition === 'bottom' ? ui.editor([ui.editingArea([ui.codable(), ui.editable()]), ui.toolbar(), ui.statusbar()]) : ui.editor([ui.toolbar(), ui.editingArea([ui.codable(), ui.editable()]), ui.statusbar()])).render();
    $editor.insertAfter($note);
    return {
      note: $note,
      editor: $editor,
      toolbar: $editor.find('.note-toolbar'),
      editingArea: $editor.find('.note-editing-area'),
      editable: $editor.find('.note-editable'),
      codable: $editor.find('.note-codable'),
      statusbar: $editor.find('.note-statusbar')
    };
  },
  removeLayout: function ($note, layoutInfo) {
    $note.html(layoutInfo.editable.html());
    layoutInfo.editor.remove();
    $note.show();
  }
};
/* harmony default export */ var bs4_ui = (ui);
// EXTERNAL MODULE: ./src/js/base/settings.js + 37 modules
var settings = __webpack_require__(3);

// EXTERNAL MODULE: ./src/styles/summernote-bs4.scss
var summernote_bs4 = __webpack_require__(5);

// CONCATENATED MODULE: ./src/js/bs4/settings.js




external_jQuery_default.a.summernote = external_jQuery_default.a.extend(external_jQuery_default.a.summernote, {
  ui: bs4_ui,
  interface: 'bs4'
});
external_jQuery_default.a.summernote.options.styleTags = ['p', {
  title: 'Blockquote',
  tag: 'blockquote',
  className: 'blockquote',
  value: 'blockquote'
}, 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/***/ })

/******/ });
});
//# sourceMappingURL=summernote-bs4.js.map