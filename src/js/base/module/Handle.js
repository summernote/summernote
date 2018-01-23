import $ from 'jquery';
import dom from '../core/dom';

export default class Handle {
  constructor(context) {
    this.context = context;
    this.$document = $(document);
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;
    this.lang = this.options.langInfo;

    this.events = {
      'summernote.mousedown': (we, e) => {
        if (this.update(e.target)) {
          e.preventDefault();
        }
      },
      'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': () => {
        this.update();
      },
      'summernote.disable': () => {
        this.hide();
      },
      'summernote.codeview.toggled': () => {
        this.update();
      }
    };
  }

  initialize() {
    this.$handle = $([
      '<div class="note-handle">',
      '<div class="note-control-selection">',
      '<div class="note-control-selection-bg"></div>',
      '<div class="note-control-holder note-control-nw"></div>',
      '<div class="note-control-holder note-control-ne"></div>',
      '<div class="note-control-holder note-control-sw"></div>',
      '<div class="',
      (this.options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
      ' note-control-se"></div>',
      (this.options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
      '</div>',
      '</div>'
    ].join('')).prependTo(this.$editingArea);

    this.$handle.on('mousedown', (event) => {
      if (dom.isControlSizing(event.target)) {
        event.preventDefault();
        event.stopPropagation();

        const $target = this.$handle.find('.note-control-selection').data('target');
        const posStart = $target.offset();
        const scrollTop = this.$document.scrollTop();

        const onMouseMove = (event) => {
          this.context.invoke('editor.resizeTo', {
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);

          this.update($target[0]);
        };

        this.$document
          .on('mousemove', onMouseMove)
          .one('mouseup', (e) => {
            e.preventDefault();
            this.$document.off('mousemove', onMouseMove);
            this.context.invoke('editor.afterCommand');
          });

        if (!$target.data('ratio')) { // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }
      }
    });

    // Listen for scrolling on the handle overlay.
    this.$handle.on('wheel', (e) => {
      e.preventDefault();
      this.update();
    });
  }

  destroy() {
    this.$handle.remove();
  }

  update(target) {
    if (this.context.isDisabled()) {
      return false;
    }

    const isImage = dom.isImg(target);
    const isVideo = dom.isVideo(target);
    
    const $selection = this.$handle.find('.note-control-selection');

    this.context.invoke('imagePopover.update', target);
    this.context.invoke('videoPopover.update', target);


    if (isImage) {
      const $image = $(target);
      const position = $image.position();
      const pos = {
        left: position.left + parseInt($image.css('marginLeft'), 10),
        top: position.top + parseInt($image.css('marginTop'), 10)
      };

      // exclude margin
      const imageSize = {
        w: $image.outerWidth(false),
        h: $image.outerHeight(false)
      };

      $selection.css({
        display: 'block',
        left: pos.left,
        top: pos.top,
        width: imageSize.w,
        height: imageSize.h
      }).data('target', $image); // save current image element.

      const origImageObj = new Image();
      origImageObj.src = $image.attr('src');

      const sizingText = imageSize.w + 'x' + imageSize.h + ' (' + this.lang.image.original + ': ' + origImageObj.width + 'x' + origImageObj.height + ')';
      $selection.find('.note-control-selection-info').text(sizingText);
      this.context.invoke('editor.saveTarget', target);
    } else {
      this.hide();
    }
    
    if (isVideo) {
      const $video = $(target);
      const position = $video.position();
      const pos = {
        left: position.left + parseInt($video.css('marginLeft'), 10),
        top: position.top + parseInt($video.css('marginTop'), 10)
      };

      // exclude margin
      const videoSize = {
        w: $video.outerWidth(false),
        h: $video.outerHeight(false)
      };

      $selection.css({
        display: 'block',
        left: pos.left,
        top: pos.top,
        width: videoSize.w,
        height: videoSize.h
      }).data('target', $video); // save current image element.
      
      const sizingText = videoSize.w + 'x' + videoSize.h;
      $selection.find('.note-control-selection-info').text(sizingText);
      this.context.invoke('editor.saveTarget', target);
    } else {
      this.hide();
    }

    return isImage ? isImage : isVideo;
  }

  /**
   * hide
   *
   * @param {jQuery} $handle
   */
  hide() {
    this.context.invoke('editor.clearTarget');
    this.$handle.children().hide();
  }
}
