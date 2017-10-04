import $ from 'jquery';
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
    var $container = this.options.dialogsInBody ? this.$body : this.$editor;

    var body = [
      '<div class="form-group note-form-group row-fluid">',
        `<label class="note-form-label">${this.lang.video.url} <small class="text-muted">${this.lang.video.providers}</small></label>`,
        '<input class="note-video-url form-control note-form-control note-input" type="text" />',
      '</div>'
    ].join('');
    var buttonClass = 'btn btn-primary note-btn note-btn-primary note-video-btn';
    var footer = `<button type="submit" href="#" class="${buttonClass}" disabled>${this.lang.video.insert}</button>`;

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
    $input.on('keypress', (event) => {
      if (event.keyCode === key.code.ENTER) {
        $btn.trigger('click');
      }
    });
  }

  createVideoNode(url) {
    // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
    var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var ytMatch = url.match(ytRegExp);

    var igRegExp = /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/;
    var igMatch = url.match(igRegExp);

    var vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
    var vMatch = url.match(vRegExp);

    var vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
    var vimMatch = url.match(vimRegExp);

    var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
    var dmMatch = url.match(dmRegExp);

    var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
    var youkuMatch = url.match(youkuRegExp);

    var qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
    var qqMatch = url.match(qqRegExp);

    var qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
    var qqMatch2 = url.match(qqRegExp2);

    var mp4RegExp = /^.+.(mp4|m4v)$/;
    var mp4Match = url.match(mp4RegExp);

    var oggRegExp = /^.+.(ogg|ogv)$/;
    var oggMatch = url.match(oggRegExp);

    var webmRegExp = /^.+.(webm)$/;
    var webmMatch = url.match(webmRegExp);

    var $video;
    if (ytMatch && ytMatch[1].length === 11) {
      var youtubeId = ytMatch[1];
      $video = $('<iframe>')
          .attr('frameborder', 0)
          .attr('src', '//www.youtube.com/embed/' + youtubeId)
          .attr('width', '640').attr('height', '360');
    } else if (igMatch && igMatch[0].length) {
      $video = $('<iframe>')
          .attr('frameborder', 0)
          .attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/')
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
    } else if ((qqMatch && qqMatch[1].length) || (qqMatch2 && qqMatch2[2].length)) {
      var vid = ((qqMatch && qqMatch[1].length) ? qqMatch[1]:qqMatch2[2]);
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
          .attr('frameborder', 0)
          .attr('height', '310')
          .attr('width', '500')
          .attr('src', 'http://v.qq.com/iframe/player.html?vid=' + vid + '&amp;auto=0');
    } else if (mp4Match || oggMatch || webmMatch) {
      $video = $('<video controls>')
          .attr('src', url)
          .attr('width', '640').attr('height', '360');
    } else {
      // this is not a known video link. Now what, Cat? Now what?
      return false;
    }

    $video.addClass('note-video-clip');

    return $video[0];
  }

  show() {
    var text = this.context.invoke('editor.getSelectedText');
    this.context.invoke('editor.saveRange');
    this.showVideoDialog(text).then((url) => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      // build node
      var $node = this.createVideoNode(url);

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
    return $.Deferred((deferred) => {
      var $videoUrl = this.$dialog.find('.note-video-url'),
          $videoBtn = this.$dialog.find('.note-video-btn');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        $videoUrl.val(text).on('input', () => {
          this.ui.toggleBtn($videoBtn, $videoUrl.val());
        }).trigger('focus');

        $videoBtn.click((event) => {
          event.preventDefault();

          deferred.resolve($videoUrl.val());
        });

        this.bindEnterKey($videoUrl, $videoBtn);
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        $videoUrl.off('input');
        $videoBtn.off('click');

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    });
  }
}
