import $ from 'jquery';
import dom from '../core/dom';

export default class Handle {
  constructor(context) {
    this.context = context;
    this.$document = $(document);
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;

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

        var $target = this.$handle.find('.note-control-selection').data('target');
        var posStart = $target.offset();
        var scrollTop = this.$document.scrollTop();

        var onMouseMove = (event) => {
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

    var isImage = dom.isImg(target);
    var $selection = this.$handle.find('.note-control-selection');

    this.context.invoke('imagePopover.update', target);

    if (isImage) {
      var $image = $(target);
      var position = $image.position();
      var pos = {
        left: position.left + parseInt($image.css('marginLeft'), 10),
        top: position.top + parseInt($image.css('marginTop'), 10)
      };

      // exclude margin
      var imageSize = {
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

      var sizingText = imageSize.w + 'x' + imageSize.h;
      $selection.find('.note-control-selection-info').text(sizingText);
      this.context.invoke('editor.saveTarget', target);
    } else {
      this.hide();
    }

    return isImage;
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
