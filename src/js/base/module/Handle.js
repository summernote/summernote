define([
  'summernote/base/core/dom'
], function (dom) {
  var Handle = function (summernote) {
    var self = this;

    var $document = $(document);

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;
    var options = summernote.options;

    this.events = {
      'summernote.mousedown': function (we, e) {
        self.update(e.target);
      },
      'summernote.keyup summernote.scroll summernote.change': function () {
        self.hide();
      }
    };

    this.initialize = function () {
      this.$handle = $([
          '<div class="note-handle">',
          '<div class="note-control-selection">',
          '<div class="note-control-selection-bg"></div>',
          '<div class="note-control-holder note-control-nw"></div>',
          '<div class="note-control-holder note-control-ne"></div>',
          '<div class="note-control-holder note-control-sw"></div>',
          '<div class="',
          (options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
          ' note-control-se"></div>',
          (options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
          '</div>',
          '</div>'
      ].join('')).prependTo($editingArea);

      dom.attachEvents($note, this.events);

      this.$handle.on('mousedown', function (event) {
        if (dom.isControlSizing(event.target)) {
          event.preventDefault();
          event.stopPropagation();

          var $target = self.$handle.find('.note-control-selection').data('target'),
              posStart = $target.offset(),
              scrollTop = $document.scrollTop();

          $document.on('mousemove', function (event) {
            summernote.invoke('editor.resizeTo', {
              x: event.clientX - posStart.left,
              y: event.clientY - (posStart.top - scrollTop)
            }, $target, !event.shiftKey);

            self.update($target[0]);
          }).one('mouseup', function (e) {
            e.preventDefault();
            $document.off('mousemove');
            summernote.invoke('editor.afterCommand');
          });

          if (!$target.data('ratio')) { // original ratio.
            $target.data('ratio', $target.height() / $target.width());
          }
        }
      });
    };

    this.destroy = function () {
      this.$handle.remove();
      dom.detachEvents($note, this.events);
    };

    this.update = function (target) {
      summernote.invoke('imagePopover.update', target);
      var $selection = this.$handle.find('.note-control-selection');

      if (dom.isImg(target)) {
        var $image = $(target);
        var pos = $image.position();

        // include margin
        var imageSize = {
          w: $image.outerWidth(true),
          h: $image.outerHeight(true)
        };

        $selection.css({
          display: 'block',
          left: pos.left,
          top: pos.top,
          width: imageSize.w,
          height: imageSize.h
        }).data('target', $image); // save current image element.

        var sizingText = imageSize.w + 'x' + imageSize.h;
        $selection.find('.note-control-selection-info').text(sizingText);
        summernote.invoke('editor.saveTarget', target);
      } else {
        this.hide();
      }
    };

    /**
     * hide
     *
     * @param {jQuery} $handle
     */
    this.hide = function () {
      summernote.invoke('editor.clearTarget');
      this.$handle.children().hide();
    };
  };

  return Handle;
});
