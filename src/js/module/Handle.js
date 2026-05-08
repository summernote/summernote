import $$ from '../core/dom-query.js';
import dom from '../core/dom';

export default class Handle {
  constructor(context) {
    this.context = context;
    this.$document = $$(document);
    this.$editingArea = context.layoutInfo.editingArea;
    this.options = context.options;
    this.lang = this.options.langInfo;

    this.events = {
      'summernote.mousedown': (we, e) => {
        if (this.update(e.target, e)) {
          e.preventDefault();
        }
      },
      'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': () => {
        this.update();
      },
      'summernote.disable': () => {
        this.hide();
      },
      'summernote.blur': (we, event) => {
        if (!this.shouldKeepVisibleOnBlur(event)) {
          this.hide();
        }
      },
      'summernote.codeview.toggled': () => {
        this.update();
      },
    };
  }

  initialize() {
    this.$handle = $$([
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
      '</div>',
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
            y: event.clientY - (posStart.top - scrollTop),
          }, $target, !event.shiftKey);

          this.update($target[0], event);
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
        return;
      }

      const target = this.resolveMediaTarget(event.target, event);
      if (target) {
        event.preventDefault();
        event.stopPropagation();
        this.update(target, event);
      }
    });

    // Listen for scrolling on the handle overlay.
    this.$handle.on('wheel', (event) => {
      event.preventDefault();
      this.update();
    });
  }

  destroy() {
    this.$handle.remove();
  }

  findMediaTargetByPoint(event) {
    const point = event?.originalEvent || event;
    if (typeof point?.clientX !== 'number' || typeof point?.clientY !== 'number') {
      return null;
    }

    const mediaNodes = this.context.layoutInfo.editable[0]?.querySelectorAll('img, video, iframe.note-video-clip') || [];

    for (const node of mediaNodes) {
      const rect = node.getBoundingClientRect();
      if (
        point.clientX >= rect.left &&
        point.clientX <= rect.right &&
        point.clientY >= rect.top &&
        point.clientY <= rect.bottom
      ) {
        return node;
      }
    }

    return null;
  }

  resolveMediaTarget(target, event) {
    if (dom.isImg(target) || dom.isVideoMedia(target)) {
      return target;
    }

    const hitTarget = this.findMediaTargetByPoint(event);
    if (hitTarget) {
      return hitTarget;
    }

    const selectionTarget = this.$handle.find('.note-control-selection').data('target');
    const selectedMedia = selectionTarget && typeof selectionTarget.get === 'function'
      ? selectionTarget.get(0)
      : selectionTarget;

    if (selectedMedia && (dom.isImg(selectedMedia) || dom.isVideoMedia(selectedMedia))) {
      if (target instanceof Element && target.closest('.note-control-selection')) {
        return selectedMedia;
      }

      const restoredTarget = this.context.invoke('editor.restoreTarget');
      if (restoredTarget === selectedMedia && target instanceof Element && target.closest('.note-handle')) {
        return selectedMedia;
      }
    }

    return null;
  }

  getSelectedMediaTarget() {
    const selectionTarget = this.$handle.find('.note-control-selection').data('target');
    return selectionTarget && typeof selectionTarget.get === 'function'
      ? selectionTarget.get(0)
      : selectionTarget;
  }

  getBlurRelatedTarget(event) {
    return event?.originalEvent?.relatedTarget || event?.relatedTarget || null;
  }

  shouldKeepVisibleOnBlur(event) {
    const relatedTarget = this.getBlurRelatedTarget(event);
    const selectedMedia = this.getSelectedMediaTarget();

    if (!(relatedTarget instanceof Element)) {
      return false;
    }

    if (this.$handle[0]?.contains(relatedTarget)) {
      return true;
    }

    if (relatedTarget.closest('.note-image-popover, .note-video-popover, .note-link-popover, .note-table-popover')) {
      return true;
    }

    return Boolean(selectedMedia && (relatedTarget === selectedMedia || selectedMedia.contains?.(relatedTarget)));
  }

  update(target, event) {
    if (this.context.isDisabled()) {
      return false;
    }

    const mediaTarget = this.resolveMediaTarget(target, event);
    const isMedia = !!mediaTarget;
    const $selection = this.$handle.find('.note-control-selection');

    this.context.invoke('imagePopover.update', mediaTarget || target, event);
    this.context.invoke('videoPopover.update', mediaTarget || target, event);

    if (isMedia) {
      const $media = $$(mediaTarget);
      $$('.note-video-clip').not((_, node) => node === mediaTarget).removeClass('note-video-interactive');

      const areaRect = this.$editingArea[0].getBoundingClientRect();
      const mediaRect = mediaTarget.getBoundingClientRect();

      $selection.css({
        display: 'block',
        left: mediaRect.left - areaRect.left,
        top: mediaRect.top - areaRect.top,
        width: mediaRect.width,
        height: mediaRect.height,
      }).data('target', $media);

      let sizingText = `${mediaRect.width}x${mediaRect.height}`;
      if (dom.isImg(mediaTarget)) {
        const origImageObj = new Image();
        origImageObj.src = $media.attr('src');
        sizingText += ` (${this.lang.image.original}: ${origImageObj.width}x${origImageObj.height})`;
      }
      $selection.find('.note-control-selection-info').text(sizingText);
      this.context.invoke('editor.saveTarget', mediaTarget);
    } else {
      this.hide();
    }

    return isMedia;
  }

  /**
   * hide
   */
  hide() {
    $$('.note-video-clip').removeClass('note-video-interactive');
    this.context.invoke('editor.clearTarget');
    this.$handle.children().hide();
  }
}
