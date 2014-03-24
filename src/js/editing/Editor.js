define([
  'core/agent', 'core/dom', 'core/range', 'core/async', 'editing/Style', 'editing/Table'
], function (agent, dom, range, async, Style, Table) {
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

  return Editor;
});
