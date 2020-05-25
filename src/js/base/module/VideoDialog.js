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
      '<div class="form-group note-form-group">',
        `<div class="note-help-block help-block">${this.lang.video.note}</div>`,
      '</div>',
      '<div class="form-group note-form-group">',
        `<label for="note-dialog-video-url-${this.options.id}" class="control-label note-form-label">${this.lang.video.url} <small class="text-muted">${this.lang.video.providers}</small></label>`,
        `<input id="note-dialog-video-url-${this.options.id}" class="note-video-url form-control note-form-control note-input" type="text"/>`,
      '</div>',
      '<div class="form-group note-form-group">',
        `<label for="note-dialog-video-aspect-${this.options.id}" class="control-label note-form-label">${this.lang.video.aspect}</label>`,
        `<select id="note-dialog-video-aspect-${this.options.id}" class="note-video-aspect form-control note-form-control note-input">`,
          '<option value="16-9">16:9</option>',
          '<option value="4-3">4:3</option>',
          '<option value="1-1">1:1</option>',
        '</select>',
      '</div>',
      '<div class="form-group note-form-group">',
        `<label for="note-dialog-video-quality-${this.options.id}" class="control-label note-form-label">${this.lang.video.quality}</label>`,
        `<select id="note-dialog-video-quality-${this.options.id}" class="note-video-quality form-control note-form-control note-input">`,
          '<option value="auto"">Auto</option>',
          '<option value="240p">240p</option>',
          '<option value="360p">360p</option>',
          '<option value="480p">480p</option>',
          '<option value="720p">720p</option>',
          '<option value="1080p">1080p</option>',
        '</select>',
      '</div>',
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-captions-' + this.options.id,
        className: 'note-video-captions',
        text: this.lang.video.captions,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-suggested-' + this.options.id,
        className: 'note-video-suggested',
        text: this.lang.video.suggested,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-controls-' + this.options.id,
        className: 'note-video-controls',
        text: this.lang.video.controls,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-autoplay-' + this.options.id,
        className: 'note-video-autoplay',
        text: this.lang.video.autoplay,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-loop-' + this.options.id,
        className: 'note-video-loop',
        text: this.lang.video.loop,
        checked: true,
      }).render()).html(),
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
    // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
    const ytRegExp = /\/\/(?:(?:www|m)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w|-]{11})(?:(?:[\?&]t=)(\S+))?$/;
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
    let urlVars = '';
    const $videoAspect = this.$dialog.find('.note-video-aspect');
    const $videoQuality = this.$dialog.find('.note-video-quality');
    const $videoSuggested = this.$dialog.find('.note-video-suggested input[type=checkbox]');
    const $videoCaptions = this.$dialog.find('.note-video-captions input[type=checkbox]');
    const $videoControls = this.$dialog.find('.note-video-controls input[type=checkbox]');
    const $videoAutoplay = this.$dialog.find('.note-video-autoplay input[type=checkbox]');
    const $videoLoop = this.$dialog.find('.note-video-loop input[type=checkbox]');

    const selectVideoAspect = $videoAspect.val();
    const selectVideoQuality = $videoQuality.val();
    const checkVideoSuggested = $videoSuggested.is(':checked');
    const checkVideoCaptions = $videoCaptions.is(':checked');
    const checkVideoControls = $videoControls.is(':checked');
    const checkVideoAutoplay = $videoAutoplay.is(':checked');
    const checkVideoLoop = $videoLoop.is(':checked');
    const vWidth = 788.54;
    const vHeight = 443;
    const vQuality = '';

    if (selectVideoAspect == '4-3') vWidth = 589.19;
    if (selectVideoAspect == '1-1') vWidth = 443;

    if (ytMatch && ytMatch[1].length === 11) { // YouTube
      const youtubeId = ytMatch[1];
      var start = 0;
      if (typeof ytMatch[2] !== 'undefined') {
        const ytMatchForStart = ytMatch[2].match(ytRegExpForStart);
        if (ytMatchForStart) {
          for (var n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
            start += (typeof ytMatchForStart[i + 1] !== 'undefined' ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0);
          }
        }
      }

      if (checkVideoSuggested) urlVars += (start > 0 ? '&' : '') + 'rel=1';
      if (checkVideoControls) urlVars += (urlVars.length > 0 ? '&' : '') + 'controls=1';
      if (checkVideoCaptions) urlVars += (urlVars.length > 0 ? '&' : '') + 'cc_load_policy=1';
      if (checkVideoAutoplay) urlVars += (urlVars.length > 0 ? '&' : '') + 'autoplay=1';
      if (checkVideoLoop) urlVars += (urlVars.length > 0 ? '&' : '') + 'loop=1';
      if (selectVideoQuality == '240p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=small';
      if (selectVideoQuality == '360p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=medium';
      if (selectVideoQuality == '480p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=large';
      if (selectVideoQuality == '720p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=hd720';
      if (selectVideoQuality == '1080p')urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=hd1080';

      $video = $('<iframe allowfullscreen>')
        .attr('frameborder', 0)
        .attr('src', '//www.youtube.com/embed/' + youtubeId + '?' + (start > 0 ? 'start=' + start : '') + (urlVars.length > 0 ? urlVars : ''))
        .attr('width', vWidth).attr('height', vHeight);
    } else if (igMatch && igMatch[0].length) { // Instagram
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/')
        .attr('width', vWidth).attr('height', vHeight)
        .attr('scrolling', 'no')
        .attr('allowtransparency', 'true');
    } else if (vMatch && vMatch[0].length) { // Vine
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', vMatch[0] + '/embed/simple')
        .attr('width', vHeight).attr('height', vWidth)
        .attr('class', 'vine-embed');
    } else if (vimMatch && vimMatch[3].length) { // Vimeo
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
        .attr('width', vWidth).attr('height', vHeight);
    } else if (dmMatch && dmMatch[2].length) { // Dailymotion
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
        .attr('width', vWidth).attr('height', vHeight);
    } else if (youkuMatch && youkuMatch[1].length) { // Youku
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('width', vWidth).attr('height', vHeight)
        .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
    } else if ((qqMatch && qqMatch[1].length) || (qqMatch2 && qqMatch2[2].length)) {
      const vid = ((qqMatch && qqMatch[1].length) ? qqMatch[1] : qqMatch2[2]);
      $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
        .attr('frameborder', 0)
        .attr('width', vWidth).attr('height', vHeight)
        .attr('src', 'https://v.qq.com/iframe/player.html?vid=' + vid + '&amp;auto=0');
    } else if (mp4Match || oggMatch || webmMatch) {
      $video = $('<video controls>')
        .attr('src', url)
        .attr('width', vWidth).attr('height', vHeight);
    } else if (fbMatch && fbMatch[0].length) { // Facebook
      $video = $('<iframe>')
        .attr('frameborder', 0)
        .attr('src', 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(fbMatch[0]) + '&show_text=0&width=' + vWidth)
        .attr('width', vWidth).attr('height', vHeight)
        .attr('scrolling', 'no')
        .attr('allowtransparency', 'true');
    } else {
      // this is not a known video link. Now what, Cat? Now what?
      return false;
    }

    $video.addClass('note-video-clip');

    return $video[0];
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
      const $videoAspect = this.$dialog.find('.note-video-aspect');
      const $videoQuality = this.$dialog.find('.note-video-quality');
      const $videoSuggested = this.$dialog.find('.note-video-suggested input[type=checkbox]');
      const $videoCaptions = this.$dialog.find('.note-video-captions input[type=checkbox]');
      const $videoControls = this.$dialog.find('.note-video-controls input[type=checkbox]');
      const $videoAutoplay = this.$dialog.find('.note-video-autoplay input[type=checkbox]');
      const $videoLoop = this.$dialog.find('.note-video-loop input[type=checkbox]');
      const $videoBtn = this.$dialog.find('.note-video-btn');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        $videoUrl.on('input paste propertychange', () => {
          this.ui.toggleBtn($videoBtn, $videoUrl.val());
        });

        if (!env.isSupportTouch) {
          $videoUrl.trigger('focus');
        }

        $videoBtn.click((event) => {
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
}
