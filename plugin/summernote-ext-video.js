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
       * @return {String}
       */
      video: function (lang) {
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
      video: function (lang) {
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
        editor.saveRange($editable);

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
      'ar-AR': {
        video: {
          video: 'فيديو',
          videoLink: 'رابط الفيديو',
          insert: 'إدراج الفيديو',
          url: 'رابط الفيديو',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion ou Youku)'
        }
      },
      'ca-ES': {
        video: {
          video: 'Video',
          videoLink: 'Enllaç del video',
          insert: 'Inserir video',
          url: 'URL del video?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, o Youku)'
        }
      },
      'cs-CZ': {
        video: {
          video: 'Video',
          videoLink: 'Odkaz videa',
          insert: 'Vložit video',
          url: 'URL videa?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion nebo Youku)'
        }
      },
      'da-DK': {
        video: {
          video: 'Video',
          videoLink: 'Video Link',
          insert: 'Indsæt Video',
          url: 'Video URL?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion eller Youku)'
        }
      },
      'de-DE': {
        video: {
          video: 'Video',
          videoLink: 'Video Link',
          insert: 'Video einfügen',
          url: 'Video URL?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, oder Youku)'
        }
      },
      'es-ES': {
        video: {
          video: 'Video',
          videoLink: 'Link del video',
          insert: 'Insertar video',
          url: '¿URL del video?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, o Youku)'
        }
      },
      'es-EU': {
        video: {
          video: 'Bideoa',
          videoLink: 'Bideorako esteka',
          insert: 'Bideo berri bat txertatu',
          url: 'Bideoaren URL helbidea',
          providers: '(YouTube, Vimeo, Vine, Instagram, edo DailyMotion)'
        }
      },
      'fa-IR': {
        video: {
          video: 'ویدیو',
          videoLink: 'لینک ویدیو',
          insert: 'افزودن ویدیو',
          url: 'آدرس ویدیو ؟',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, یا Youku)'
        }
      },
      'fi-FI': {
        video: {
          video: 'Video',
          videoLink: 'Linkki videoon',
          insert: 'Lisää video',
          url: 'Videon URL-osoite?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion tai Youku)'
        }
      },
      'fr-FR': {
        video: {
          video: 'Vidéo',
          videoLink: 'Lien vidéo',
          insert: 'Insérer une vidéo',
          url: 'URL de la vidéo',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion ou Youku)'
        }
      },
      'he-IL': {
        video: {
          video: 'סרטון',
          videoLink: 'קישור לסרטון',
          insert: 'הוסף סרטון',
          url: 'קישור לסרטון',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion או Youku)'
        }
      },
      'hu-HU': {
        video: {
          video: 'Videó',
          videoLink: 'Videó hivatkozás',
          insert: 'Videó beszúrása',
          url: 'Videó URL címe',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, vagy Youku)'
        }
      },
      'id-ID': {
        video: {
          video: 'Video',
          videoLink: 'Link video',
          insert: 'Sisipkan video',
          url: 'Tautan video',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, atau Youku)'
        }
      },
      'it-IT': {
        video: {
          video: 'Video',
          videoLink: 'Collegamento ad un Video',
          insert: 'Inserisci Video',
          url: 'URL del Video',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion o Youku)'
        }
      },
      'ja-JP': {
        video: {
          video: '動画',
          videoLink: '動画リンク',
          insert: '動画挿入',
          url: '動画のURL',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, Youku)'
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
      },
      'nb-NO': {
        video: {
          video: 'Video',
          videoLink: 'Videolenke',
          insert: 'Sett inn video',
          url: 'Video-URL',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion eller Youku)'
        }
      },
      'nl-NL': {
        video: {
          video: 'Video',
          videoLink: 'Video link',
          insert: 'Video invoegen',
          url: 'URL van de video',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion of Youku)'
        }
      },
      'pl-PL': {
        video: {
          video: 'Wideo',
          videoLink: 'Adres wideo',
          insert: 'Wstaw wideo',
          url: 'Adres wideo',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, lub Youku)'
        }
      },
      'pt-BR': {
        video: {
          video: 'Vídeo',
          videoLink: 'Link para vídeo',
          insert: 'Inserir vídeo',
          url: 'URL do vídeo?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, ou Youku)'
        }
      },
      'ro-RO': {
        video: {
          video: 'Video',
          videoLink: 'Link video',
          insert: 'Inserează video',
          url: 'URL video?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion, sau Youku)'
        }
      },
      'ru-RU': {
        video: {
          video: 'Видео',
          videoLink: 'Ссылка на видео',
          insert: 'Вставить видео',
          url: 'URL видео',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion или Youku)'
        }
      },
      'sk-SK': {
        video: {
          video: 'Video',
          videoLink: 'Odkaz videa',
          insert: 'Vložiť video',
          url: 'URL videa?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion nebo Youku)'
        }
      },
      'sl-SI': {
        video: {
          video: 'Video',
          videoLink: 'Video povezava',
          insert: 'Vstavi video',
          url: 'Povezava do videa',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion ali Youku)'
        }
      },
      'sr-RS': {
        video: {
          video: 'Видео',
          videoLink: 'Веза ка видеу',
          insert: 'Уметни видео',
          url: 'URL видео',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion или Youku)'
        }
      },
      'sr-RS-Latin': {
        video: {
          video: 'Video',
          videoLink: 'Veza ka videu',
          insert: 'Umetni video',
          url: 'URL video',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion ili Youku)'
        }
      },
      'sv-SE': {
        video: {
          video: 'Filmklipp',
          videoLink: 'Länk till filmklipp',
          insert: 'Infoga filmklipp',
          url: 'Länk till filmklipp',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion eller Youku)'
        }
      },
      'th-TH': {
        video: {
          video: 'วีดีโอ',
          videoLink: 'ลิงก์ของวีดีโอ',
          insert: 'แทรกวีดีโอ',
          url: 'ที่อยู่ URL ของวีดีโอ?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion หรือ Youku)'
        }
      },
      'tr-TR': {
        video: {
          video: 'Video',
          videoLink: 'Video bağlantısı',
          insert: 'Video ekle',
          url: 'Video bağlantısı?',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion veya Youku)'
        }
      },
      'uk-UA': {
        video: {
          video: 'Відео',
          videoLink: 'Посилання на відео',
          insert: 'Вставити відео',
          url: 'URL відео',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion чи Youku)'
        }
      },
      'vi-VN': {
        video: {
          video: 'Video',
          videoLink: 'Đường Dẫn đến Video',
          insert: 'Chèn Video',
          url: 'URL',
          providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion và Youku)'
        }
      },
      'zh-CN': {
        video: {
          video: '视频',
          videoLink: '视频链接',
          insert: '插入视频',
          url: '视频地址',
          providers: '(优酷, Instagram, DailyMotion, Youtube等)'
        }
      },
      'zh-TW': {
        video: {
          video: '影片',
          videoLink: '影片連結',
          insert: '插入影片',
          url: '影片網址',
          providers: '(優酷, Instagram, DailyMotion, Youtube等)'
        }
      }
    }
  });
})(jQuery);
