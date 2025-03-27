import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';

export default class VideoDialog {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = [
      '<div class="form-group note-form-group row-fluid">',
        `<label for="note-dialog-video-url-${this.options.id}" class="note-form-label">${this.lang.video.url} <small class="text-muted">${this.lang.video.providers}</small></label>`,
        `<input id="note-dialog-video-url-${this.options.id}" class="note-video-url form-control note-form-control note-input" type="text"/>`,
      '</div>',
    ].join('');
    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-video-btn';
    const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.video.insert}" disabled>`;

    this.$dialog = this.ui.dialog({
      title: this.lang.video.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer,
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', (event) => {
      if (event.keyCode === key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  createVideoNode(url) {
    // video url patterns(youtube, instagram, vimeo, dailymotion, youku, peertube, mp4, ogg, webm)
    const ytRegExp = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/|live\/))([^&\n?]+)(?:.*[?&]t=([^&\n]+))?.*/;
    const ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
    const ytMatch = url.match(ytRegExp);

    const gdRegExp = /(?:\.|\/\/)drive\.google\.com\/file\/d\/(.[a-zA-Z0-9_-]*)\/view/;
    const gdMatch = url.match(gdRegExp);

    const igRegExp = /(?:www\.|\/\/)instagram\.com\/(reel|p)\/(.[a-zA-Z0-9_-]*)/;
    const igMatch = url.match(igRegExp);

    const vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
    const vMatch = url.match(vRegExp);

    const vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
    const vimMatch = url.match(vimRegExp);

    const dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
    const dmMatch = url.match(dmRegExp);

    const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
    const youkuMatch = url.match(youkuRegExp);

    const peerTubeRegExp =/\/\/(.*)\/videos\/watch\/([^?]*)(?:\?(?:start=(\w*))?(?:&stop=(\w*))?(?:&loop=([10]))?(?:&autoplay=([10]))?(?:&muted=([10]))?)?/;
    const peerTubeMatch = url.match(peerTubeRegExp);

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
            start += (typeof ytMatchForStart[i + 1] !== 'undefined' ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0);
          }
        }else{
          start = parseInt(ytMatch[2], 10);
        }
      }
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', '//www.youtube.com/embed/' + youtubeId + (start > 0 ? '?start=' + start : ''))
        .attr('width', '640').attr('height', '360');
    } else if (gdMatch && gdMatch[0].length) {
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', 'https://drive.google.com/file/d/' + gdMatch[1] + '/preview')
        .attr('width', '640').attr('height', '480');
    } else if (igMatch && igMatch[0].length) {
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', 'https://instagram.com/p/' + igMatch[2] + '/embed/')
        .attr('width', '612').attr('height', '710')
        .attr('scrolling', 'no')
        .attr('allowtransparency', 'true');
    } else if (vMatch && vMatch[0].length) {
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', vMatch[0] + '/embed/simple')
        .attr('width', '600').attr('height', '600')
        .attr('class', 'vine-embed');
    } else if (vimMatch && vimMatch[3].length) {
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
        .attr('width', '640').attr('height', '360');
    } else if (dmMatch && dmMatch[2].length) {
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
        .attr('width', '640').attr('height', '360');
    } else if (youkuMatch && youkuMatch[1].length) {
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('height', '498')
        .attr('width', '510')
        .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
    } else if (peerTubeMatch && peerTubeMatch[0].length){
      var begin = 0;
      if (peerTubeMatch[2] !== 'undefined') begin = peerTubeMatch[2];
      var end =0;
      if (peerTubeMatch[3] !== 'undefined') end = peerTubeMatch[3];
      var loop = 0;
      if (peerTubeMatch[4] !== 'undefined') loop = peerTubeMatch[4];
      var autoplay = 0;
      if (peerTubeMatch[5] !== 'undefined') autoplay = peerTubeMatch[5];
      var muted = 0;
      if (peerTubeMatch[6] !== 'undefined') muted = peerTubeMatch[6];
      $video = $('<iframe allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups">')
        .attr('frameborder', 0)
        .attr('src', '//'+ peerTubeMatch[1] +'/videos/embed/' + peerTubeMatch[2]+"?loop="+loop
      +"&autoplay="+autoplay+"&muted="+muted +(begin > 0 ? '&start=' + begin : '')+(end > 0 ? '&end=' + start : ''))
        .attr('width', '560')
        .attr('height', '315');
    }else if ((qqMatch && qqMatch[1].length) || (qqMatch2 && qqMatch2[2].length)) {
      const vid = ((qqMatch && qqMatch[1].length) ? qqMatch[1] : qqMatch2[2]);
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('height', '310')
        .attr('width', '500')
        .attr('src', 'https://v.qq.com/txp/iframe/player.html?vid=' + vid + '&amp;auto=0');
    } else if (mp4Match || oggMatch || webmMatch) {
      $video = $('<video controls>')
        .attr('src', url)
        .attr('width', '640').attr('height', '360');
    } else if (fbMatch && fbMatch[0].length) {
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(fbMatch[0]) + '&show_text=0&width=560')
        .attr('width', '560').attr('height', '301')
        .attr('scrolling', 'no')
        .attr('allowtransparency', 'true');
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
    this.showVideoDialog(text).then((url) => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      // build node
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
   * show video dialog
   *
   * @param {jQuery} $dialog
   * @return {Promise}
   */
  showVideoDialog(/* text */) {
    return $.Deferred((deferred) => {
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

        $videoBtn.on('click', (event) => {
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
