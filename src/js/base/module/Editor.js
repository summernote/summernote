define([
  'summernote/base/core/agent',
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/key',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/core/async',
  'summernote/base/editing/History',
  'summernote/base/editing/Style',
  'summernote/base/editing/Typing',
  'summernote/base/editing/Table',
  'summernote/base/editing/Bullet'
], function (
  agent, func, list, key, dom, range, async,
  History, Style, Typing, Table, Bullet
) {

  var KEY_BOGUS = 'bogus';

  /**
   * @class Editor
   * @param {Summernote} summernote
   */
  var Editor = function (summernote) {
    var self = this;

    var $editable = summernote.layoutInfo.editable;
    var options = summernote.options;

    var style = new Style();
    var table = new Table();
    var typing = new Typing();
    var bullet = new Bullet();
    var history = new History($editable);

    this.initialize = function () {
      var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
      this.bindKeyMap(keyMap);

      $editable.on('keyup', function (event) {
        summernote.triggerEvent('keyup', event);
      }).on('mouseup', function (event) {
        summernote.triggerEvent('mouseup', event);
      }).on('input', function (event) {
        summernote.triggerEvent('change', event);
      }).on('scroll', function (event) {
        summernote.triggerEvent('scroll', event);
      });

      if (options.height) {
        $editable.height(options.height);
      }
    };

    this.destroy = function () {
      $editable.off('keydown');
    };

    this.bindKeyMap = function (keyMap) {
      $editable.on('keydown', function (event) {
        var keys = [];

        if (event.metaKey) { keys.push('CMD'); }
        if (event.ctrlKey && !event.altKey) { keys.push('CTRL'); }
        if (event.shiftKey) { keys.push('SHIFT'); }

        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) {
          keys.push(keyName);
        }

        var eventName = keyMap[keys.join('+')];
        if (eventName) {
          if (self[eventName]) {
            self[eventName](options);
            event.preventDefault();
          }
        } else if (key.isEdit(event.keyCode)) {
          self.afterCommand($editable);
        }
      });
    };

    /**
     * createRange
     *
     * create range
     * @return {WrappedRange}
     */
    this.createRange = function () {
      this.focus();
      return range.create();
    };

    /**
     * saveRange
     *
     * save current range
     *
     * @param {Boolean} [thenCollapse=false]
     */
    this.saveRange = function (thenCollapse) {
      this.focus();
      $editable.data('range', range.create());
      if (thenCollapse) {
        range.create().collapse().select();
      }
    };

    /**
     * restoreRange
     *
     * restore lately range
     */
    this.restoreRange = function () {
      var rng = $editable.data('range');
      if (rng) {
        rng.select();
        this.focus();
      }
    };

    this.saveTarget = function (node) {
      $editable.data('target', node);
    };

    this.clearTarget = function () {
      $editable.removeData('target');
    };

    this.restoreTarget = function () {
      return $editable.data('target');
    };

    /**
     * currentStyle
     *
     * current style
     * @return {Object|Boolean} unfocus
     */
    this.currentStyle = function () {
      var rng = range.create();
      if (rng) {
        rng = rng.normalize();
      }
      return rng ? style.current(rng) : style.fromNode($editable);
    };

    /**
     * style from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
    this.styleFromNode = function ($node) {
      return style.fromNode($node);
    };

    /**
     * undo
     * undo
     */
    this.undo = function () {
      summernote.triggerEvent('before.command', $editable.html());
      history.undo();
      summernote.triggerEvent('change', $editable.html());
    };

    /**
     * redo
     * redo
     */
    this.redo = function () {
      summernote.triggerEvent('before.command', $editable.html());
      history.redo();
      summernote.triggerEvent('change', $editable.html());
    };

    /**
     * beforeCommand
     * before command
     */
    var beforeCommand = this.beforeCommand = function () {
      summernote.triggerEvent('before.command', $editable.html());
      // keep focus on editable before command execution
      self.focus();
    };

    /**
     * afterCommand
     * after command
     * @param {Boolean} isPreventTrigger
     */
    var afterCommand = this.afterCommand = function (isPreventTrigger) {
      history.recordUndo();
      if (!isPreventTrigger) {
        summernote.triggerEvent('change', $editable.html());
      }
    };

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
                    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                    'formatBlock', 'removeFormat',
                    'backColor', 'foreColor', 'fontName'];

    for (var idx = 0, len = commands.length; idx < len; idx ++) {
      this[commands[idx]] = (function (sCmd) {
        return function (value) {
          beforeCommand();
          document.execCommand(sCmd, false, value);
          afterCommand(true);
        };
      })(commands[idx]);
    }
    /* jshint ignore:end */

    /**
     * tab
     *
     * handle tab key
     */
    this.tab = function () {
      var rng = this.createRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng);
      } else {
        beforeCommand();
        typing.insertTab($editable, rng, options.tabSize);
        afterCommand();
      }
    };

    /**
     * untab
     *
     * handle shift+tab key
     *
     */
    this.untab = function () {
      var rng = this.createRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng, true);
      }
    };

    /**
     * insertParagraph
     *
     * insert paragraph
     */
    this.insertParagraph = function () {
      beforeCommand();
      typing.insertParagraph($editable);
      afterCommand();
    };

    /**
     * insertOrderedList
     */
    this.insertOrderedList = function () {
      beforeCommand();
      bullet.insertOrderedList($editable);
      afterCommand();
    };

    this.insertUnorderedList = function () {
      beforeCommand();
      bullet.insertUnorderedList($editable);
      afterCommand();
    };

    this.indent = function () {
      beforeCommand();
      bullet.indent($editable);
      afterCommand();
    };

    this.outdent = function () {
      beforeCommand();
      bullet.outdent($editable);
      afterCommand();
    };

    /**
     * insert image
     *
     * @param {String} sUrl
     */
    this.insertImage = function (sUrl, filename) {
      async.createImage(sUrl, filename).then(function ($image) {
        beforeCommand();
        $image.css({
          display: '',
          width: Math.min($editable.width(), $image.width())
        });
        range.create().insertNode($image[0]);
        range.createFromNodeAfter($image[0]).select();
        afterCommand();
      }).fail(function () {
        summernote.triggerEvent('image.upload.error');
      });
    };

    /**
     * insertNode
     * insert node
     * @param {Node} node
     */
    this.insertNode = function (node) {
      beforeCommand();
      range.create().insertNode(node);
      range.createFromNodeAfter(node).select();
      afterCommand();
    };

    /**
     * insert text
     * @param {String} text
     */
    this.insertText = function (text) {
      beforeCommand();
      var textNode = range.create().insertNode(dom.createText(text));
      range.create(textNode, dom.nodeLength(textNode)).select();
      afterCommand();
    };

    /**
     * paste HTML
     * @param {String} markup
     */
    this.pasteHTML = function (markup) {
      beforeCommand();
      var contents = range.create().pasteHTML(markup);
      range.createFromNodeAfter(list.last(contents)).select();
      afterCommand();
    };

    /**
     * formatBlock
     *
     * @param {String} tagName
     */
    this.formatBlock = function (tagName) {
      beforeCommand();
      // [workaround] for MSIE, IE need `<`
      tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
      document.execCommand('FormatBlock', false, tagName);
      afterCommand();
    };

    this.formatPara = function () {
      beforeCommand();
      this.formatBlock('P');
      afterCommand();
    };

    /* jshint ignore:start */
    for (var idx = 1; idx <= 6; idx ++) {
      this['formatH' + idx] = function (idx) {
        return function () {
          this.formatBlock('H' + idx);
        };
      }(idx);
    };
    /* jshint ignore:end */

    /**
     * fontSize
     *
     * @param {String} value - px
     */
    this.fontSize = function (value) {
      var rng = range.create();

      if (rng.isCollapsed()) {
        var spans = style.styleNodes(rng);
        var firstSpan = list.head(spans);

        $(spans).css({
          'font-size': value + 'px'
        });

        // [workaround] added styled bogus span for style
        //  - also bogus character needed for cursor position
        if (firstSpan && !dom.nodeLength(firstSpan)) {
          firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
          range.createFromNodeAfter(firstSpan.firstChild).select();
          $editable.data(KEY_BOGUS, firstSpan);
        }
      } else {
        beforeCommand();
        $(style.styleNodes(rng)).css({
          'font-size': value + 'px'
        });
        afterCommand();
      }
    };

    /**
     * insert horizontal rule
     */
    this.insertHorizontalRule = function () {
      beforeCommand();

      var rng = range.create();
      var hrNode = rng.insertNode($('<HR/>')[0]);
      if (hrNode.nextSibling) {
        range.create(hrNode.nextSibling, 0).normalize().select();
      }

      afterCommand();
    };

    /**
     * remove bogus node and character
     */
    this.removeBogus = function () {
      var bogusNode = $editable.data(KEY_BOGUS);
      if (!bogusNode) {
        return;
      }

      var textNode = list.find(list.from(bogusNode.childNodes), dom.isText);

      var bogusCharIdx = textNode.nodeValue.indexOf(dom.ZERO_WIDTH_NBSP_CHAR);
      if (bogusCharIdx !== -1) {
        textNode.deleteData(bogusCharIdx, 1);
      }

      if (dom.isEmpty(bogusNode)) {
        dom.remove(bogusNode);
      }

      $editable.removeData(KEY_BOGUS);
    };

    /**
     * lineHeight
     * @param {String} value
     */
    this.lineHeight = function (value) {
      beforeCommand();
      style.stylePara(range.create(), {
        lineHeight: value
      });
      afterCommand();
    };

    /**
     * unlink
     *
     * @type command
     */
    this.unlink = function () {
      var rng = this.createRange();
      if (rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(anchor);
        rng.select();

        beforeCommand();
        document.execCommand('unlink');
        afterCommand();
      }
    };

    /**
     * create link (command)
     *
     * @param {Object} linkInfo
     */
    this.createLink = function (linkInfo) {
      var linkUrl = linkInfo.url;
      var linkText = linkInfo.text;
      var isNewWindow = linkInfo.isNewWindow;
      var rng = linkInfo.range || this.createRange();
      var isTextChanged = rng.toString() !== linkText;

      beforeCommand();

      if (options.onCreateLink) {
        linkUrl = options.onCreateLink(linkUrl);
      }

      var anchors = [];
      if (isTextChanged) {
        // Create a new link when text changed.
        var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
        anchors.push(anchor);
      } else {
        anchors = style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true
        });
      }

      $.each(anchors, function (idx, anchor) {
        $(anchor).attr('href', linkUrl);
        if (isNewWindow) {
          $(anchor).attr('target', '_blank');
        } else {
          $(anchor).removeAttr('target');
        }
      });

      var startRange = range.createFromNodeBefore(list.head(anchors));
      var startPoint = startRange.getStartPoint();
      var endRange = range.createFromNodeAfter(list.last(anchors));
      var endPoint = endRange.getEndPoint();

      range.create(
        startPoint.node,
        startPoint.offset,
        endPoint.node,
        endPoint.offset
      ).select();

      afterCommand();
    };

    /**
     * returns link info
     *
     * @return {Object}
     * @return {WrappedRange} return.range
     * @return {String} return.text
     * @return {Boolean} [return.isNewWindow=true]
     * @return {String} [return.url=""]
     */
    this.getLinkInfo = function () {
      this.focus();

      var rng = range.create().expand(dom.isAnchor);

      // Get the first anchor on range(for edit).
      var $anchor = $(list.head(rng.nodes(dom.isAnchor)));

      return {
        range: rng,
        text: rng.toString(),
        isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : false,
        url: $anchor.length ? $anchor.attr('href') : ''
      };
    };

    /**
     * setting color
     *
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */
    this.color = function (colorInfo) {
      var foreColor = colorInfo.foreColor;
      var backColor = colorInfo.backColor;

      beforeCommand();

      if (foreColor) { document.execCommand('foreColor', false, foreColor); }
      if (backColor) { document.execCommand('backColor', false, backColor); }

      afterCommand();
    };

    /**
     * insert Table
     *
     * @param {String} sDim dimension of table (ex : "5x5")
     */
    this.insertTable = function (sDim) {
      var dimension = sDim.split('x');
      beforeCommand();

      var rng = range.create().deleteContents();
      rng.insertNode(table.createTable(dimension[0], dimension[1], options));
      afterCommand();
    };

    /**
     * float me
     *
     * @param {String} value
     */
    this.floatMe = function (value) {
      beforeCommand();
      var $target = $(this.restoreTarget());
      $target.css('float', value);
      afterCommand();
    };

    /**
     * resize overlay element
     * @param {String} value
     */
    this.resize = function (value) {
      beforeCommand();

      var $target = $(this.restoreTarget());
      $target.css({
        width: value * 100 + '%',
        height: ''
      });

      afterCommand();
    };

    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [bKeepRatio] - keep ratio
     */
    this.resizeTo = function (pos, $target, bKeepRatio) {
      var imageSize;
      if (bKeepRatio) {
        var newRatio = pos.y / pos.x;
        var ratio = $target.data('ratio');
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
    };

    /**
     * remove media object
     */
    this.removeMedia = function () {
      beforeCommand();
      var $target = $(this.restoreTarget()).detach();
      summernote.triggerEvent('media.delete', $target, $editable);
      afterCommand();
    };

    /**
     * set focus
     */
    this.focus = function () {
      $editable.focus();

      // [workaround] for firefox bug http://goo.gl/lVfAaI
      if (agent.isFF) {
        var rng = range.create();
        if (!rng || rng.isOnEditable()) {
          return;
        }

        range.createFromNode($editable[0])
             .normalize()
             .collapse()
             .select();
      }
    };

    /**
     * returns whether contents is empty or not.
     * @return {Boolean}
     */
    this.isEmpty = function () {
      return dom.isEmpty($editable[0]) || dom.emptyPara === $editable.html();
    };
  };

  return Editor;
});
