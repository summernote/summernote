define([
  'summernote/base/core/key'
], function (key) {
  var VideoDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = '<div class="form-group row-fluid">' +
          '<label>' + lang.video.url + ' <small class="text-muted">' + lang.video.providers + '</small></label>' +
          '<input class="note-video-url form-control span12" type="text" />' +
          '</div>';
      var footer = '<button href="#" class="btn btn-primary note-video-btn disabled" disabled>' + lang.video.insert + '</button>';

      this.$dialog = ui.dialog({
        title: lang.video.insert,
        fade: options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    this.createVideoNode = function (url) {
      // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
      var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      var ytMatch = url.match(ytRegExp);

      var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9_-]*)/;
      var igMatch = url.match(igRegExp);

      var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
      var vMatch = url.match(vRegExp);

      var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      var vimMatch = url.match(vimRegExp);

      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = url.match(dmRegExp);

      var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
      var youkuMatch = url.match(youkuRegExp);

      var mp4RegExp = /^.+.(mp4|m4v)$/;
      var mp4Match = url.match(mp4RegExp);

      var oggRegExp = /^.+.(ogg|ogv)$/;
      var oggMatch = url.match(oggRegExp);

      var webmRegExp = /^.+.(webm)$/;
      var webmMatch = url.match(webmRegExp);

      var $elm = $('<div class="note-video-clip embed-responsive" />');
      var $video = $('<iframe class="embed-responsive-item" frameborder="0" allowfullscreen />');

      if (ytMatch && ytMatch[1].length === 11) {
        //youtube
        $elm.addClass('embed-responsive-16by9');
        $video.attr('src', 'https://www.youtube.com/embed/' + ytMatch[1]);
      } else if (igMatch && igMatch[0].length) {
        //instagram
        $elm.addClass('embed-responsive-1by1');
        $video
            .attr('src', igMatch[0] + '/embed/')
            .attr('scrolling', 'no')
            .attr('allowtransparency', 'true');
      } else if (vMatch && vMatch[0].length) {
        //vine
        $elm.addClass('embed-responsive-1by1');
        $video.attr('src', vMatch[0] + '/embed/simple');
      } else if (vimMatch && vimMatch[3].length) {
        //vimeo
        $elm.addClass('embed-responsive-16by9');
        $video.attr('src', 'https://player.vimeo.com/video/' + vimMatch[3]);
      } else if (dmMatch && dmMatch[2].length) {
        //dailymotion
        $elm.addClass('embed-responsive-16by9');
        $video.attr('src', 'https://www.dailymotion.com/embed/video/' + dmMatch[2]);
      } else if (youkuMatch && youkuMatch[1].length) {
        //youku
        $elm.addClass('embed-responsive-4by3');
        $video.attr('src', 'http://player.youku.com/embed/' + youkuMatch[1]);
      } else if (mp4Match || oggMatch || webmMatch) {
        $elm.addClass('embed-responsive-16by9');
        $video = $('<video class="embed-responsive-item" controls>')
            .attr('src', url);
      } else {
        // this is not a known video link. Now what, Cat? Now what?
        return false;
      }

      $elm.append($video);

      return $elm[0];
    };

    this.show = function () {
      var text = context.invoke('editor.getSelectedText');
      context.invoke('editor.saveRange');
      this.showVideoDialog(text).then(function (url) {
        // [workaround] hide dialog before restore range for IE range focus
        ui.hideDialog(self.$dialog);
        context.invoke('editor.restoreRange');

        // build node
        var $node = self.createVideoNode(url);

        if ($node) {
          // insert video node
          context.invoke('editor.insertNode', $node);
        }
      }).fail(function () {
        context.invoke('editor.restoreRange');
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showVideoDialog = function (text) {
      return $.Deferred(function (deferred) {
        var $videoUrl = self.$dialog.find('.note-video-url'),
            $videoBtn = self.$dialog.find('.note-video-btn');

        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');

          $videoUrl.val(text).on('input', function () {
            ui.toggleBtn($videoBtn, $videoUrl.val());
          }).trigger('focus');

          $videoBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($videoUrl.val());
          });

          self.bindEnterKey($videoUrl, $videoBtn);
        });

        ui.onDialogHidden(self.$dialog, function () {
          $videoUrl.off('input');
          $videoBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      });
    };
  };

  return VideoDialog;
});
