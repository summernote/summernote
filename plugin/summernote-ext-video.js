(function ($) {
  // template, editor
  var tmpl = $.summernote.renderer.getTemplate();
  var editor = $.summernote.eventHandler.getEditor();

  // core functions: range, dom
  var range = $.summernote.core.range;
  var dom = $.summernote.core.dom;

  /**
   * createVideoNode
   *
   * @param {String} url
   * @return {Node}
   */
  var createVideoNode = function (url) {
      // video url patterns(youtube, instagram, vimeo, dailymotion, youku)
      var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      var ytMatch = url.match(ytRegExp);

      var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9]*)/;
      var igMatch = url.match(igRegExp);

      var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
      var vMatch = url.match(vRegExp);

      var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      var vimMatch = url.match(vimRegExp);

      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = url.match(dmRegExp);

      var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)\.html/;
      var youkuMatch = url.match(youkuRegExp);

      var $video;
      if (ytMatch && ytMatch[1].length === 11) {
        var youtubeId = ytMatch[1];
        $video = $('<iframe>')
          .attr('src', '//www.youtube.com/embed/' + youtubeId)
          .attr('width', '640').attr('height', '360');
      } else if (igMatch && igMatch[0].length) {
        $video = $('<iframe>')
          .attr('src', igMatch[0] + '/embed/')
          .attr('width', '612').attr('height', '710')
          .attr('scrolling', 'no')
          .attr('allowtransparency', 'true');
      } else if (vMatch && vMatch[0].length) {
        $video = $('<iframe>')
          .attr('src', vMatch[0] + '/embed/simple')
          .attr('width', '600').attr('height', '600')
          .attr('class', 'vine-embed');
      } else if (vimMatch && vimMatch[3].length) {
        $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
          .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
          .attr('width', '640').attr('height', '360');
      } else if (dmMatch && dmMatch[2].length) {
        $video = $('<iframe>')
          .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
          .attr('width', '640').attr('height', '360');
      } else if (youkuMatch && youkuMatch[1].length) {
        $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
          .attr('height', '498')
          .attr('width', '510')
          .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
      } else {
        // this is not a known video link. Now what, Cat? Now what?
      }

      $video.attr('frameborder', 0);

      return $video[0];
  };

  /**
   * @param {jQuery} $editable
   * @return {String}
   */
  var getTextOnRange = function ($editable) {
    $editable.focus();

    var rng = range.create();

    // if range on anchor, expand range with anchor
    if (rng.isOnAnchor()) {
      var anchor = dom.ancestor(rng.sc, dom.isAnchor);
      rng = range.createFromNode(anchor);
    }

    return rng.toString();
  };

  /**
   * toggle button status
   *
   * @param {jQuery} $btn
   * @param {Boolean} isEnable
   */
  var toggleBtn = function ($btn, isEnable) {
    $btn.toggleClass('disabled', !isEnable);
    $btn.attr('disabled', !isEnable);
  };

  /**
   * Show video dialog and set event handlers on dialog controls.
   *
   * @param {jQuery} $dialog 
   * @param {jQuery} $dialog
   * @param {Object} text
   * @return {Promise}
   */
  var showVideoDialog = function ($editable, $dialog, text) {
    return $.Deferred(function (deferred) {
      var $videoDialog = $dialog.find('.note-video-dialog');

      var $videoUrl = $videoDialog.find('.note-video-url'),
          $videoBtn = $videoDialog.find('.note-video-btn');

      $videoDialog.one('shown.bs.modal', function () {
        $videoUrl.val(text).keyup(function () {
          toggleBtn($videoBtn, $videoUrl.val());
        }).trigger('keyup').trigger('focus');

        $videoBtn.click(function (event) {
          event.preventDefault();

          deferred.resolve($videoUrl.val());
          $videoDialog.modal('hide');
        });
      }).one('hidden.bs.modal', function () {
        $videoUrl.off('keyup');
        $videoBtn.off('click');

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      }).modal('show');
    });
  };

  // add video plugin
  $.summernote.addPlugin({
    name: 'video',
    buttons: {
      /**
       * @param {Object} lang
       * @param {Object} options
       * @return {String}
       */
      video: function (lang, options) {
        return tmpl.iconButton('fa fa-youtube-play', {
          event: 'showVideoDialog',
          title: lang.video.video,
          hide: true
        });
      }
    },

    dialogs: {
      /**
       * @param {Object} lang
       * @param {Object} options
       * @return {String}
       */
      video: function (lang, options) {
        var body = '<div class="form-group row-fluid">' +
                     '<label>' + lang.video.url + ' <small class="text-muted">' + lang.video.providers + '</small></label>' +
                     '<input class="note-video-url form-control span12" type="text" />' +
                   '</div>';
        var footer = '<button href="#" class="btn btn-primary note-video-btn disabled" disabled>' + lang.video.insert + '</button>';
        return tmpl.dialog('note-video-dialog', lang.video.insert, body, footer);
      }
    },

    events: {
      /**
       * @param {Object} layoutInfo
       */
      showVideoDialog: function (layoutInfo) {
        var $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable(),
            text = getTextOnRange($editable);

        // save current range
        editor.saveRange($editable)

        showVideoDialog($editable, $dialog, text).then(function (url) {
          // when ok button clicked

          // restore range
          editor.restoreRange($editable);

          // insert video node
          editor.insertNode($editable, createVideoNode(url));
        }).fail(function () {
          // when cancel button clicked
          editor.restoreRange($editable);
        });
      }
    },

    // define language
    langs: {
      'en-US': {
        video: {
          video: 'Video',
          videoLink: 'Video Link',
          insert: 'Insert Video',
          url: 'Video URL?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
        }
      },
      'ko-KR': {
        video: {
          video: '동영상',
          videoLink: '동영상 링크',
          insert: '동영상 추가',
          url: '동영상 URL',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, Youku 사용 가능)'
        }
      }
    }
  });
})(jQuery);
