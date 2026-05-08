import $$ from '../core/dom-query.js';
import lists from '../core/lists';
import dom from '../core/dom';
import {
  computeImagePopoverPlacement,
} from './ImagePopover.js';

export default class VideoPopover {
  constructor(context) {
    this.context = context;
    this.ui = $$.summernote.ui;
    this.options = context.options;

    this.events = {
      'summernote.disable summernote.dialog.shown': () => {
        this.hide();
      },
      'summernote.blur': (we, event) => {
        if (!this.shouldKeepVisibleOnBlur(event)) {
          this.hide();
        }
      },
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.video);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-video-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.video, {
      classPrefix: 'popover',
    });

    this.$popover.on('mousedown', (event) => { event.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  getBlurRelatedTarget(event) {
    return event?.originalEvent?.relatedTarget || event?.relatedTarget || null;
  }

  shouldKeepVisibleOnBlur(event) {
    const relatedTarget = this.getBlurRelatedTarget(event);

    if (!(relatedTarget instanceof Element)) {
      return false;
    }

    if (this.$popover[0]?.contains(relatedTarget)) {
      return true;
    }

    return Boolean(this.anchorState?.target && (
      relatedTarget === this.anchorState.target || this.anchorState.target.contains?.(relatedTarget)
    ));
  }

  getPointerLeft(event, mediaLeft, mediaWidth) {
    const point = event?.originalEvent?.touches?.[0]
      || event?.originalEvent?.changedTouches?.[0]
      || event?.originalEvent
      || event;

    if (point && typeof point.pageX === 'number') {
      return Math.min(Math.max(point.pageX - $$(this.options.container).offset().left, mediaLeft), mediaLeft + mediaWidth);
    }

    if (point && typeof point.clientX === 'number') {
      return Math.min(Math.max(point.clientX + window.scrollX - $$(this.options.container).offset().left, mediaLeft), mediaLeft + mediaWidth);
    }

    return null;
  }

  getPointerTop(event, mediaTop, mediaHeight) {
    const point = event?.originalEvent?.touches?.[0]
      || event?.originalEvent?.changedTouches?.[0]
      || event?.originalEvent
      || event;

    if (point && typeof point.pageY === 'number') {
      return Math.min(Math.max(point.pageY - $$(this.options.container).offset().top, mediaTop), mediaTop + mediaHeight);
    }

    if (point && typeof point.clientY === 'number') {
      return Math.min(Math.max(point.clientY + window.scrollY - $$(this.options.container).offset().top, mediaTop), mediaTop + mediaHeight);
    }

    return null;
  }

  applyPlacementStyles(placement) {
    this.$popover.attr('data-popper-placement', placement);
  }

  update(target, event) {
    if (dom.isVideoMedia(target)) {
      const $target = $$(target);
      const position = $target.offset();
      const containerOffset = $$(this.options.container).offset();
      const containerWidth = $$(this.options.container).innerWidth();
      const containerHeight = $$(this.options.container).innerHeight();
      const mediaWidth = $target.outerWidth();
      const mediaHeight = $target.outerHeight();

      this.$popover.css({
        display: 'block',
        visibility: 'hidden',
        left: 0,
        top: 0,
      });

      const popoverWidth = this.$popover.outerWidth();
      const popoverHeight = this.$popover.outerHeight();
      const mediaLeft = position.left - containerOffset.left;
      const mediaTop = position.top - containerOffset.top;
      const pointerLeft = this.getPointerLeft(event, mediaLeft, mediaWidth);
      const pointerTop = this.getPointerTop(event, mediaTop, mediaHeight);

      if (pointerLeft !== null || pointerTop !== null) {
        this.anchorState = {
          target,
          offsetX: pointerLeft !== null ? pointerLeft - mediaLeft : mediaWidth / 2,
          offsetY: pointerTop !== null ? pointerTop - mediaTop : null,
        };
      }

      const anchorLeft = this.anchorState?.target === target
        ? mediaLeft + Math.min(Math.max(this.anchorState.offsetX, 0), mediaWidth)
        : mediaLeft + (mediaWidth / 2);
      const anchorTop = this.anchorState?.target === target && typeof this.anchorState.offsetY === 'number'
        ? mediaTop + Math.min(Math.max(this.anchorState.offsetY, 0), mediaHeight)
        : null;
      const { left, top, placement } = computeImagePopoverPlacement({
        containerWidth,
        containerHeight,
        imageTop: mediaTop,
        imageHeight: mediaHeight,
        popoverWidth,
        popoverHeight,
        anchorLeft,
        anchorTop,
      });

      this.applyPlacementStyles(placement, anchorLeft, left, popoverWidth);

      this.$popover.css({
        display: 'block',
        visibility: 'visible',
        left,
        top,
      });
    } else {
      this.hide();
    }
  }

  hide() {
    this.anchorState = null;
    this.$popover.hide();
  }
}
