define([
  'core/agent', 'core/dom', 'core/range', 'core/async', 'editing/Style'
], function (agent, dom, range, async, Style) {
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

    this.insertVideo = function ($editable, sUrl) {
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
          .attr('src', 'http://www.youtube.com/embed/' + youtubeId)
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
          .attr('src', 'http://www.dailymotion.com/embed/video/' + dmMatch[2])
          .attr('width', '640').attr('height', '360');
      } else {
        // this is not a known video link. Now what, Cat? Now what?
      }

      if ($video) {
        $video.attr('frameborder', 0);
        range.create().insertNode($video[0]);
      }
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

    this.setVideoDialog = function ($editable, fnShowDialog) {
      var rng = range.create();
      var editor = this;

      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.create(elAnchor, 0, elAnchor, 1);
      }

      fnShowDialog({
        range: rng,
        text: rng.toString()
      }, function (sLinkUrl) {
        rng.select();
        recordUndo($editable);
        editor.insertVideo($editable, sLinkUrl);
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

  return Editor;
});
