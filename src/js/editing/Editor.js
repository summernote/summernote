define([
  'summernote/core/agent',
  'summernote/core/func',
  'summernote/core/list',
  'summernote/core/dom',
  'summernote/core/range',
  'summernote/core/async',
  'summernote/editing/Style',
  'summernote/editing/Typing',
  'summernote/editing/Table',
  'summernote/editing/Bullet'
], function (agent, func, list, dom, range, async,
             Style, Typing, Table, Bullet) {
  /**
   * Editor
   * @class
   */
  var Editor = function () {

    var style = new Style();
    var table = new Table();
    var typing = new Typing();
    var bullet = new Bullet();

    /**
     * create range
     */
    this.createRange = function ($editable) {
      $editable.focus();
      return range.create();
    };

    /**
     * save current range
     *
     * @param {jQuery} $editable
     */
    this.saveRange = function ($editable, thenCollapse) {
      $editable.focus();
      $editable.data('range', range.create());
      if (thenCollapse) {
        range.create().collapse().select();
      }
    };

    this.saveNode = function ($editable) {
      // copy child node reference
      var copy = [];
      for (var key  = 0, len = $editable[0].childNodes.length; key < len; key++) {
        copy.push($editable[0].childNodes[key]);
      }
      $editable.data('childNodes', copy);
    };

    /**
     * restore lately range
     *
     * @param {jQuery} $editable
     */
    this.restoreRange = function ($editable) {
      var rng = $editable.data('range');
      if (rng) {
        rng.select();
        $editable.focus();
      }
    };

    this.restoreNode = function ($editable) {
      $editable.html('');
      var child = $editable.data('childNodes');
      for (var index = 0, len = child.length; index < len; index++) {
        $editable[0].appendChild(child[index]);
      }
    };
    /**
     * current style
     * @param {Node} target
     */
    this.currentStyle = function (target) {
      var rng = range.create();
      return rng ? rng.isOnEditable() && style.current(rng, target) : false;
    };

    var triggerOnChange = this.triggerOnChange = function ($editable) {
      var onChange = $editable.data('callbacks').onChange;
      if (onChange) {
        onChange($editable.html(), $editable);
      }
    };

    /**
     * undo
     * @param {jQuery} $editable
     */
    this.undo = function ($editable) {
      $editable.data('NoteHistory').undo();
      triggerOnChange($editable);
    };

    /**
     * redo
     * @param {jQuery} $editable
     */
    this.redo = function ($editable) {
      $editable.data('NoteHistory').redo();
      triggerOnChange($editable);
    };

    /**
     * after command
     * @param {jQuery} $editable
     */
    var afterCommand = this.afterCommand = function ($editable) {
      $editable.data('NoteHistory').recordUndo();
      triggerOnChange($editable);
    };

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
                    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                    'formatBlock', 'removeFormat',
                    'backColor', 'foreColor', 'insertHorizontalRule', 'fontName'];

    for (var idx = 0, len = commands.length; idx < len; idx ++) {
      this[commands[idx]] = (function (sCmd) {
        return function ($editable, value) {
          document.execCommand(sCmd, false, value);

          afterCommand($editable);
        };
      })(commands[idx]);
    }
    /* jshint ignore:end */

    /**
     * handle tab key
     *
     * @param {jQuery} $editable
     * @param {Object} options
     */
    this.tab = function ($editable, options) {
      var rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng);
      } else {
        typing.insertTab($editable, rng, options.tabsize);
        afterCommand($editable);
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
     * insert paragraph
     *
     * @param {Node} $editable
     */
    this.insertParagraph = function ($editable) {
      typing.insertParagraph($editable);
      afterCommand($editable);
    };

    /**
     * @param {jQuery} $editable
     */
    this.insertOrderedList = function ($editable) {
      bullet.insertOrderedList($editable);
      afterCommand($editable);
    };

    /**
     * @param {jQuery} $editable
     */
    this.insertUnorderedList = function ($editable) {
      bullet.insertUnorderedList($editable);
      afterCommand($editable);
    };

    /**
     * @param {jQuery} $editable
     */
    this.indent = function ($editable) {
      bullet.indent($editable);
      afterCommand($editable);
    };

    /**
     * @param {jQuery} $editable
     */
    this.outdent = function ($editable) {
      bullet.outdent($editable);
      afterCommand($editable);
    };

    /**
     * insert image
     *
     * @param {jQuery} $editable
     * @param {String} sUrl
     */
    this.insertImage = function ($editable, sUrl, filename) {
      async.createImage(sUrl, filename).then(function ($image) {
        $image.css({
          display: '',
          width: Math.min($editable.width(), $image.width())
        });
        range.create().insertNode($image[0]);
        afterCommand($editable);
      }).fail(function () {
        var callbacks = $editable.data('callbacks');
        if (callbacks.onImageUploadError) {
          callbacks.onImageUploadError();
        }
      });
    };

    /**
     * insert node
     * @param {Node} $editable
     * @param {Node} node
     * @param {Boolean} [isInline]
     */
    this.insertNode = function ($editable, node, isInline) {
      range.create().insertNode(node, isInline);
      afterCommand($editable);
    };

    /**
     * insert text
     * @param {Node} $editable
     * @param {String} text
     */
    this.insertText = function ($editable, text) {
      var textNode = this.createRange($editable).insertNode(dom.createText(text), true);
      range.create(textNode, dom.nodeLength(textNode)).select();
      afterCommand($editable);
    };

    /**
     * formatBlock
     *
     * @param {jQuery} $editable
     * @param {String} tagName
     */
    this.formatBlock = function ($editable, tagName) {
      tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
      document.execCommand('FormatBlock', false, tagName);
      afterCommand($editable);
    };

    this.formatPara = function ($editable) {
      this.formatBlock($editable, 'P');
      afterCommand($editable);
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
     * applyFont
     *
     * @param {Node} start node
     * @param {INT} start offset
     * @param {Node} end node
     * @param {INT} end offset
     * @param {String} color
     * @param {String} bgcolor
     * @param {String} size - px
     */
    this.applyFont = function ($editable, color, bgcolor, size) {
      var rng = range.create();
      var startPoint = rng.getStartPoint();
      var endPoint = rng.getEndPoint();

      if (rng.isCollapsed()) {
        return {
          sc: startPoint.node,
          so: startPoint.offset,
          ec: endPoint.node,
          offset: endPoint.offset
        };
      }

      var ancestor, node, font, $font,
        fonts = [], nodes = [],
        k, i, className, className2, style, style2;

      // get first and last point
      if (endPoint.offset && endPoint.offset !== dom.nodeLength(endPoint.node)) {
        ancestor = dom.ancestor(endPoint.node, dom.isFont) || endPoint.node;
        dom.splitTree(ancestor, endPoint);
      }
      if (startPoint.offset && startPoint.offset !== dom.nodeLength(startPoint.node)) {
        ancestor = dom.ancestor(startPoint.node, dom.isFont) || startPoint.node;
        node = dom.splitTree(ancestor, startPoint);
        if (endPoint.node === startPoint.node) {
          endPoint.node = node;
          endPoint.offset = dom.nodeLength(node);
        }
        startPoint.node = node;
        startPoint.offset = 0;
      }

      // get list of nodes to change
      dom.walkPoint(startPoint, endPoint, function (point) {
        node = point.node;
        if ((dom.isText(node) && dom.isVisibleText(node)) ||
          (dom.isFont(node) && !dom.isVisibleText(node))) {
          nodes.push(point.node);
        }
      });
      nodes = list.unique(nodes);

      // apply font: foreColor, backColor, size (the color can be use a class text-... or bg-...)
      if (color || bgcolor || size) {
        for (i = 0; i < nodes.length; i++) {
          node = nodes[i];

          font = dom.ancestor(node, dom.isFont);
          if (!font) {
            if (node.textContent.match(/^[ ]|[ ]$/)) {
              node.textContent = node.textContent.replace(/^[ ]|[ ]$/g, '\u00A0');
            }

            font = dom.create('font');
            node.parentNode.insertBefore(font, node);
            font.appendChild(node);
          }

          fonts.push(font);

          className = font.className.split(/\s+/);

          if (color) {
            for (k = 0; k < className.length; k++) {
              if (!className[k].length && className[k].slice(0, 5) === 'text-') {
                className.splice(k, 1);
                k--;
              }
            }

            if (color.indexOf('text-') !== -1) {
              font.className = className.join(' ') + ' ' + color;
              font.style.color = 'inherit';
            } else {
              font.className = className.join(' ');
              font.style.color = color;
            }
          }
          if (bgcolor) {
            for (k = 0; k < className.length; k++) {
              if (className[k].length && className[k].slice(0, 3) === 'bg-') {
                className.splice(k, 1);
                k--;
              }
            }

            if (bgcolor.indexOf('bg-') !== -1) {
              font.className = className.join(' ') + ' ' + bgcolor;
              font.style.backgroundColor = 'inherit';
            } else {
              font.className = className.join(' ');
              font.style.backgroundColor = bgcolor;
            }
          }
          if (size) {
            font.style.fontSize = 'inherit';
            if (parseInt(window.getComputedStyle(font).fontSize, 10) !== size) {
              font.style.fontSize = size + 'px';
            }
          }
        }
      }

      // remove empty values
      // we must remove the value in 2 steps (applay inherit then remove) because some
      // browser like chrome have some time an error for the rendering and/or keep inherit
      for (i = 0; i < fonts.length; i++) {
        font = fonts[i];
        if (font.style.backgroundColor === 'inherit') {
          font.style.backgroundColor = '';
        }
        if (font.style.color === 'inherit') {
          font.style.color = '';
        }
        if (font.style.fontSize === 'inherit') {
          font.style.fontSize = '';
        }

        $font = $(font);

        if (!$font.css('color') && !$font.css('background-color') && !$font.css('font-size')) {
          $font.removeAttr('style');
        }
        if (!font.className.length) {
          $font.removeAttr('class');
        }
      }

      // select nodes to clean (to remove empty font and merge same nodes)
      nodes = [];
      dom.walkPoint(startPoint, endPoint, function (point) {
        nodes.push(point.node);
      });
      nodes = list.unique(nodes);

      function remove(node, to) {
        if (node === endPoint.node) {
          endPoint = dom.prevPoint(endPoint);
        }
        if (to) {
          dom.moveContent(node, to);
        }
        dom.remove(node);
      }

      // remove node without attributes (move content), and merge the same nodes
      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        if ((dom.isText(node) || dom.isBR(node)) && !dom.isVisibleText(node)) {
          remove(node);
          nodes.splice(i, 1);
          i--;
          continue;
        }

        font = dom.ancestor(node, dom.isFont);
        node = font || dom.ancestor(node, dom.isSpan);

        if (!node) {
          continue;
        }

        $font = $(node);
        className = dom.orderClass(node);
        style = dom.orderStyle(node);

        if (!className && !style) {
          remove(node, node.parentNode);
          nodes.splice(i, 1);
          i--;
          continue;
        }

        if (i > 0 && (font = dom.ancestor(nodes[i - 1], dom.isFont))) {
          className2 = font.getAttribute('class');
          style2 = font.getAttribute('style');
          if (node !== font && className === className2 && style === style2) {
            remove(node, font);
            nodes.splice(i, 1);
            i--;
            continue;
          }
        }
      }

      range.create(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset).select();
    };

    /**
     * fontsize
     *
     * @param {jQuery} $editable
     * @param {String} value - px
     */
    this.fontSize = function ($editable, value) {
      this.applyFont($editable, null, null, value);
      afterCommand($editable);
    };

    /**
     * lineHeight
     * @param {jQuery} $editable
     * @param {String} value
     */
    this.lineHeight = function ($editable, value) {
      style.stylePara(range.create(), {
        lineHeight: value
      });
      afterCommand($editable);
    };

    /**
     * unlink
     *
     * @type command
     *
     * @param {jQuery} $editable
     */
    this.unlink = function ($editable) {
      var rng = range.create();
      if (rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(anchor);
        rng.select();
        document.execCommand('unlink');

        afterCommand($editable);
      }
    };

    /**
     * create link
     *
     * @type command
     *
     * @param {jQuery} $editable
     * @param {Object} linkInfo
     * @param {Object} options
     */
    this.createLink = function ($editable, linkInfo, options) {
      var linkUrl = linkInfo.url;
      var linkText = linkInfo.text;
      var isNewWindow = linkInfo.newWindow;
      var rng = linkInfo.range;

      if (options.onCreateLink) {
        linkUrl = options.onCreateLink(linkUrl);
      }

      rng = rng.deleteContents();

      // Create a new link when there is no anchor on range.
      var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0], true);
      $(anchor).attr({
        href: linkUrl,
        target: isNewWindow ? '_blank' : ''
      });

      range.createFromNode(anchor).select();
      afterCommand($editable);
    };

    /**
     * returns link info
     *
     * @return {Object}
     */
    this.getLinkInfo = function ($editable) {
      $editable.focus();

      var rng = range.create().expand(dom.isAnchor);

      // Get the first anchor on range(for edit).
      var $anchor = $(list.head(rng.nodes(dom.isAnchor)));

      return {
        range: rng,
        text: rng.toString(),
        isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : true,
        url: $anchor.length ? $anchor.attr('href') : ''
      };
    };

    this.color = function ($editable, sObjColor) {
      var oColor = JSON.parse(sObjColor);
      var foreColor = oColor.foreColor, backColor = oColor.backColor;

      if (foreColor) { this.foreColor($editable, foreColor); }
      if (backColor) { this.backColor($editable, backColor); }
    };
    this.foreColor = function ($editable, foreColor) {
      this.applyFont($editable, foreColor, null, null);
      afterCommand($editable);
    };
    this.backColor = function ($editable, backColor) {
      var r = range.create();
      if (r.isCollapsed() && r.isOnCell()) {
        var cell = dom.ancestor(r.sc, dom.isCell);
        cell.className = cell.className.replace(new RegExp('(^|\\s+)bg-[^\\s]+(\\s+|$)', 'gi'), '');
        cell.style.backgroundColor = '';
        if (backColor.indexOf('bg-') !== -1) {
          cell.className += ' ' + backColor;
        } else if (backColor !== 'inherit') {
          cell.style.backgroundColor = backColor;
        }
        return;
      }
      this.applyFont($editable, null, backColor, null);
      afterCommand($editable);
    };

    this.insertTable = function ($editable, sDim) {
      var dimension = sDim.split('x');
      var rng = range.create();
      rng = rng.deleteContents();
      rng.insertNode(table.createTable(dimension[0], dimension[1]));
      afterCommand($editable);
    };

    /**
     * @param {jQuery} $editable
     * @param {String} value
     * @param {jQuery} $target
     */
    this.floatMe = function ($editable, value, $target) {
      $target.css('float', value);
      afterCommand($editable);
    };

    this.imageShape = function ($editable, value, $target) {
      $target.removeClass('img-rounded img-circle img-thumbnail');

      if (value) {
        $target.addClass(value);
      }

      afterCommand($editable);
    };

    /**
     * resize overlay element
     * @param {jQuery} $editable
     * @param {String} value
     * @param {jQuery} $target - target element
     */
    this.resize = function ($editable, value, $target) {
      $target.css({
        width: value * 100 + '%',
        height: ''
      });

      afterCommand($editable);
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
     *
     * @param {jQuery} $editable
     * @param {String} value - dummy argument (for keep interface)
     * @param {jQuery} $target - target element
     */
    this.removeMedia = function ($editable, value, $target) {
      $target.detach();

      afterCommand($editable);
    };
  };

  return Editor;
});
