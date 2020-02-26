import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';
import lists from '../core/lists';
import dom from '../core/dom';
import range from '../core/range';
import { readFileAsDataURL, createImage } from '../core/async';
import History from '../editing/History';
import Style from '../editing/Style';
import Typing from '../editing/Typing';
import Table from '../editing/Table';
import Bullet from '../editing/Bullet';

const KEY_BOGUS = 'bogus';

/**
 * @class Editor
 */
export default class Editor {
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

    this.style = new Style();
    this.table = new Table();
    this.typing = new Typing(context);
    this.bullet = new Bullet();
    this.history = new History(context);

    this.context.memo('help.escape', this.lang.help.escape);
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
    this.context.memo('help.fontName', this.lang.help.fontName);

    // native commands(with execCommand), generate function for execCommand
    const commands = [
      'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
      'formatBlock', 'removeFormat', 'backColor',
    ];

    for (let idx = 0, len = commands.length; idx < len; idx++) {
      this[commands[idx]] = ((sCmd) => {
        return (value) => {
          this.beforeCommand();
          document.execCommand(sCmd, false, value);
          this.afterCommand(true);
        };
      })(commands[idx]);
      this.context.memo('help.' + commands[idx], this.lang.help[commands[idx]]);
    }

    this.fontName = this.wrapCommand((value) => {
      return this.fontStyling('font-family', env.validFontName(value));
    });

    this.fontSize = this.wrapCommand((value) => {
      const unit = this.currentStyle()['font-size-unit'];
      return this.fontStyling('font-size', value + unit);
    });

    this.fontSizeUnit = this.wrapCommand((value) => {
      const size = this.currentStyle()['font-size'];
      return this.fontStyling('font-size', size + value);
    });

    for (let idx = 1; idx <= 6; idx++) {
      this['formatH' + idx] = ((idx) => {
        return () => {
          this.formatBlock('H' + idx);
        };
      })(idx);
      this.context.memo('help.formatH' + idx, this.lang.help['formatH' + idx]);
    }

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
    this.insertNode = this.wrapCommand((node) => {
      if (this.isLimited($(node).text().length)) {
        return;
      }
      const rng = this.getLastRange();
      rng.insertNode(node);
      this.setLastRange(range.createFromNodeAfter(node).select());
    });

    /**
     * insert text
     * @param {String} text
     */
    this.insertText = this.wrapCommand((text) => {
      if (this.isLimited(text.length)) {
        return;
      }
      const rng = this.getLastRange();
      const textNode = rng.insertNode(dom.createText(text));
      this.setLastRange(range.create(textNode, dom.nodeLength(textNode)).select());
    });

    /**
     * paste HTML
     * @param {String} markup
     */
    this.pasteHTML = this.wrapCommand((markup) => {
      if (this.isLimited(markup.length)) {
        return;
      }
      markup = this.context.invoke('codeview.purify', markup);
      const contents = this.getLastRange().pasteHTML(markup);
      this.setLastRange(range.createFromNodeAfter(lists.last(contents)).select());
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
        this.setLastRange(range.create(hrNode.nextSibling, 0).normalize().select());
      }
    });

    /**
     * lineHeight
     * @param {String} value
     */
    this.lineHeight = this.wrapCommand((value) => {
      this.style.stylePara(this.getLastRange(), {
        lineHeight: value,
      });
    });

    /**
     * create link (command)
     *
     * @param {Object} linkInfo
     */
    this.createLink = this.wrapCommand((linkInfo) => {
      let linkUrl = linkInfo.url;
      const linkText = linkInfo.text;
      const isNewWindow = linkInfo.isNewWindow;
      const checkProtocol = linkInfo.checkProtocol;
      let rng = linkInfo.range || this.getLastRange();
      const additionalTextLength = linkText.length - rng.toString().length;
      if (additionalTextLength > 0 && this.isLimited(additionalTextLength)) {
        return;
      }
      const isTextChanged = rng.toString() !== linkText;

      // handle spaced urls from input
      if (typeof linkUrl === 'string') {
        linkUrl = linkUrl.trim();
      }

      if (this.options.onCreateLink) {
        linkUrl = this.options.onCreateLink(linkUrl);
      } else if (checkProtocol) {
        // if url doesn't have any protocol and not even a relative or a label, use http:// as default
        linkUrl = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkUrl)
          ? linkUrl : this.options.defaultProtocol + linkUrl;
      }

      let anchors = [];
      if (isTextChanged) {
        rng = rng.deleteContents();
        const anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
        anchors.push(anchor);
      } else {
        anchors = this.style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true,
        });
      }

      $.each(anchors, (idx, anchor) => {
        $(anchor).attr('href', linkUrl);
        if (isNewWindow) {
          $(anchor).attr('target', '_blank');
        } else {
          $(anchor).removeAttr('target');
        }
      });

      const startRange = range.createFromNodeBefore(lists.head(anchors));
      const startPoint = startRange.getStartPoint();
      const endRange = range.createFromNodeAfter(lists.last(anchors));
      const endPoint = endRange.getEndPoint();

      this.setLastRange(
        range.create(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
        ).select()
      );
    });

    /**
     * setting color
     *
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */
    this.color = this.wrapCommand((colorInfo) => {
      const foreColor = colorInfo.foreColor;
      const backColor = colorInfo.backColor;

      if (foreColor) { document.execCommand('foreColor', false, foreColor); }
      if (backColor) { document.execCommand('backColor', false, backColor); }
    });

    /**
     * Set foreground color
     *
     * @param {String} colorCode foreground color code
     */
    this.foreColor = this.wrapCommand((colorInfo) => {
      document.execCommand('foreColor', false, colorInfo);
    });

    /**
     * insert Table
     *
     * @param {String} dimension of table (ex : "5x5")
     */
    this.insertTable = this.wrapCommand((dim) => {
      const dimension = dim.split('x');

      const rng = this.getLastRange().deleteContents();
      rng.insertNode(this.table.createTable(dimension[0], dimension[1], this.options));
    });

    /**
     * remove media object and Figure Elements if media object is img with Figure.
     */
    this.removeMedia = this.wrapCommand(() => {
      let $target = $(this.restoreTarget()).parent();
      if ($target.closest('figure').length) {
        $target.closest('figure').remove();
      } else {
        $target = $(this.restoreTarget()).detach();
      }
      this.context.triggerEvent('media.delete', $target, this.$editable);
    });

    /**
     * float me
     *
     * @param {String} value
     */
    this.floatMe = this.wrapCommand((value) => {
      const $target = $(this.restoreTarget());
      $target.toggleClass('note-float-left', value === 'left');
      $target.toggleClass('note-float-right', value === 'right');
      $target.css('float', (value === 'none' ? '' : value));
    });

    /**
     * resize overlay element
     * @param {String} value
     */
    this.resize = this.wrapCommand((value) => {
      const $target = $(this.restoreTarget());
      value = parseFloat(value);
      if (value === 0) {
        $target.css('width', '');
      } else {
        $target.css({
          width: value * 100 + '%',
          height: '',
        });
      }
    });
  }

  initialize() {
    // bind custom events
    this.$editable.on('keydown', (event) => {
      if (event.keyCode === key.code.ENTER) {
        this.context.triggerEvent('enter', event);
      }
      this.context.triggerEvent('keydown', event);

      // keep a snapshot to limit text on input event
      this.snapshot = this.history.makeSnapshot();
      this.hasKeyShortCut = false;
      if (!event.isDefaultPrevented()) {
        if (this.options.shortcuts) {
          this.hasKeyShortCut = this.handleKeyMap(event);
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

      // record undo in the key event except keyMap.
      if (this.options.recordEveryKeystroke) {
        if (this.hasKeyShortCut === false) {
          this.history.recordUndo();
        }
      }
    }).on('keyup', (event) => {
      this.setLastRange();
      this.context.triggerEvent('keyup', event);
    }).on('focus', (event) => {
      this.setLastRange();
      this.context.triggerEvent('focus', event);
    }).on('blur', (event) => {
      this.context.triggerEvent('blur', event);
    }).on('mousedown', (event) => {
      this.context.triggerEvent('mousedown', event);
    }).on('mouseup', (event) => {
      this.setLastRange();
      this.history.recordUndo();
      this.context.triggerEvent('mouseup', event);
    }).on('scroll', (event) => {
      this.context.triggerEvent('scroll', event);
    }).on('paste', (event) => {
      this.setLastRange();
      this.context.triggerEvent('paste', event);
    }).on('input', () => {
      // To limit composition characters (e.g. Korean)
      if (this.isLimited(0) && this.snapshot) {
        this.history.applySnapshot(this.snapshot);
      }
    });

    this.$editable.attr('spellcheck', this.options.spellCheck);

    this.$editable.attr('autocorrect', this.options.spellCheck);

    if (this.options.disableGrammar) {
      this.$editable.attr('data-gramm', false);
    }

    // init content before set event
    this.$editable.html(dom.html(this.$note) || dom.emptyPara);

    this.$editable.on(env.inputEventName, func.debounce(() => {
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }, 10));

    this.$editable.on('focusin', (event) => {
      this.context.triggerEvent('focusin', event);
    }).on('focusout', (event) => {
      this.context.triggerEvent('focusout', event);
    });

    if (this.options.airMode) {
      if (this.options.overrideContextMenu) {
        this.$editor.on('contextmenu', (event) => {
          this.context.triggerEvent('contextmenu', event);
          return false;
        });
      }
    } else {
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

    if (event.metaKey) { keys.push('CMD'); }
    if (event.ctrlKey && !event.altKey) { keys.push('CTRL'); }
    if (event.shiftKey) { keys.push('SHIFT'); }

    const keyName = key.nameFromCode[event.keyCode];
    if (keyName) {
      keys.push(keyName);
    }

    const eventName = keyMap[keys.join('+')];

    if (keyName === 'TAB' && !this.options.tabDisable) {
      this.afterCommand();
    } else if (eventName) {
      if (this.context.invoke(eventName) !== false) {
        event.preventDefault();
        // if keyMap action was invoked
        return true;
      }
    } else if (key.isEdit(event.keyCode)) {
      this.afterCommand();
    }
    return false;
  }

  preventDefaultEditableShortCuts(event) {
    // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
    if ((event.ctrlKey || event.metaKey) &&
      lists.contains([66, 73, 85], event.keyCode)) {
      event.preventDefault();
    }
  }

  isLimited(pad, event) {
    pad = pad || 0;

    if (typeof event !== 'undefined') {
      if (key.isMove(event.keyCode) ||
          key.isNavigation(event.keyCode) ||
          (event.ctrlKey || event.metaKey) ||
          lists.contains([key.code.BACKSPACE, key.code.DELETE], event.keyCode)) {
        return false;
      }
    }

    if (this.options.maxTextLength > 0) {
      if ((this.$editable.text().length + pad) > this.options.maxTextLength) {
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
      this.lastRange = range.create(this.editable);

      if ($(this.lastRange.sc).closest('.note-editable').length === 0) {
        this.lastRange = range.createFromBodyElement(this.editable);
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
    let rng = range.create();
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
    this.context.triggerEvent('before.command', this.$editable.html());

    // Set styleWithCSS before run a command
    document.execCommand('styleWithCSS', false, this.options.styleWithCSS);

    // keep focus on editable before command execution
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
    return function() {
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
    return createImage(src, param).then(($image) => {
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
      this.setLastRange(range.createFromNodeAfter($image[0]).select());
      this.afterCommand();
    }).fail((e) => {
      this.context.triggerEvent('image.upload.error', e);
    });
  }

  /**
   * insertImages
   * @param {File[]} files
   */
  insertImagesAsDataURL(files) {
    $.each(files, (idx, file) => {
      const filename = file.name;
      if (this.options.maximumImageFileSize && this.options.maximumImageFileSize < file.size) {
        this.context.triggerEvent('image.upload.error', this.lang.image.maximumFileSizeError);
      } else {
        readFileAsDataURL(file).then((dataURL) => {
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
    const callbacks = this.options.callbacks;
    // If onImageUpload set,
    if (callbacks.onImageUpload) {
      this.context.triggerEvent('image.upload', files);
      // else insert Image as dataURL
    } else {
      this.insertImagesAsDataURL(files);
    }
  }

  /**
   * return selected plain text
   * @return {String} text
   */
  getSelectedText() {
    let rng = this.getLastRange();

    // if range on anchor, expand range with anchor
    if (rng.isOnAnchor()) {
      rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
    }

    return rng.toString();
  }

  onFormatBlock(tagName, $target) {
    // [workaround] for MSIE, IE need `<`
    document.execCommand('FormatBlock', false, env.isMSIE ? '<' + tagName + '>' : tagName);

    // support custom class
    if ($target && $target.length) {
      // find the exact element has given tagName
      if ($target[0].tagName.toUpperCase() !== tagName.toUpperCase()) {
        $target = $target.find(tagName);
      }

      if ($target && $target.length) {
        const className = $target[0].className || '';
        if (className) {
          const currentRange = this.createRange();

          const $parent = $([currentRange.sc, currentRange.ec]).closest(tagName);
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
      $(spans).css(target, value);

      // [workaround] added styled bogus span for style
      //  - also bogus character needed for cursor position
      if (rng.isCollapsed()) {
        const firstSpan = lists.head(spans);
        if (firstSpan && !dom.nodeLength(firstSpan)) {
          firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
          range.createFromNodeAfter(firstSpan.firstChild).select();
          this.setLastRange();
          this.$editable.data(KEY_BOGUS, firstSpan);
        }
      }
    } else {
      const noteStatusOutput = $.now();
      this.$editor.find('.note-status-output').html('<div id="note-status-output-' + noteStatusOutput + '" class="alert alert-info">' + this.lang.output.noSelection + '</div>');
      setTimeout(function() { $('#note-status-output-' + noteStatusOutput).remove(); }, 5000);
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
      rng = range.createFromNode(anchor);
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
    const rng = this.getLastRange().expand(dom.isAnchor);
    // Get the first anchor on range(for edit).
    const $anchor = $(lists.head(rng.nodes(dom.isAnchor)));
    const linkInfo = {
      range: rng,
      text: rng.toString(),
      url: $anchor.length ? $anchor.attr('href') : '',
    };

    // When anchor exists,
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
        height: ratio > newRatio ? pos.x * ratio : pos.y,
      };
    } else {
      imageSize = {
        width: pos.x,
        height: pos.y,
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
