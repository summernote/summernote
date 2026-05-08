import $$ from '../core/dom-query.js';
import lists from '../core/lists';
import dom from '../core/dom';

export const IMAGE_POPOVER_GAP = 16;
export const IMAGE_POPOVER_ARROW_OFFSET = 20;

export function computeImagePopoverPlacement({
  containerWidth,
  containerHeight,
  imageTop,
  imageHeight,
  popoverWidth,
  popoverHeight,
  anchorLeft,
  anchorTop,
}) {
  const maxLeft = Math.max(0, containerWidth - popoverWidth);

  let left = anchorLeft - IMAGE_POPOVER_ARROW_OFFSET;
  left = Math.min(Math.max(left, 0), maxLeft);

  const maxTop = Math.max(0, (containerHeight || 0) - popoverHeight);
  const maxBottomTop = typeof imageHeight === 'number'
    ? Math.min(imageTop + imageHeight, maxTop)
    : maxTop;
  const preferredTop = typeof anchorTop === 'number'
    ? Math.min(anchorTop + IMAGE_POPOVER_GAP, maxBottomTop)
    : null;
  const fallbackTop = Math.max(imageTop - popoverHeight - IMAGE_POPOVER_GAP, 0);
  const top = preferredTop !== null && preferredTop >= imageTop
    ? preferredTop
    : fallbackTop;
  const placement = top === fallbackTop ? 'top' : 'bottom';

  return { left, top, placement };
}

/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */
export default class ImagePopover {
  constructor(context) {
    this.context = context;
    this.ui = $$.summernote.ui;

    this.editable = context.layoutInfo.editable[0];
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

  getPointerLeft(event, imageLeft, imageWidth) {
    const point = event?.originalEvent?.touches?.[0]
      || event?.originalEvent?.changedTouches?.[0]
      || event?.originalEvent
      || event;

    if (point && typeof point.pageX === 'number') {
      return Math.min(Math.max(point.pageX - $$(this.options.container).offset().left, imageLeft), imageLeft + imageWidth);
    }

    if (point && typeof point.clientX === 'number') {
      return Math.min(Math.max(point.clientX + window.scrollX - $$(this.options.container).offset().left, imageLeft), imageLeft + imageWidth);
    }

    return null;
  }

  getPointerTop(event, imageTop, imageHeight) {
    const point = event?.originalEvent?.touches?.[0]
      || event?.originalEvent?.changedTouches?.[0]
      || event?.originalEvent
      || event;

    if (point && typeof point.pageY === 'number') {
      return Math.min(Math.max(point.pageY - $$(this.options.container).offset().top, imageTop), imageTop + imageHeight);
    }

    if (point && typeof point.clientY === 'number') {
      return Math.min(Math.max(point.clientY + window.scrollY - $$(this.options.container).offset().top, imageTop), imageTop + imageHeight);
    }

    return null;
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.image);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-image-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.image, {
      classPrefix: 'popover',
    });

    this.$popover.on('mousedown', (event) => { event.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  applyPlacementStyles(placement) {
    this.$popover.attr('data-popper-placement', placement);
  }

  update(target, event) {
    if (dom.isImg(target)) {
      const $target = $$(target);
      const position = $target.offset();
      const containerOffset = $$(this.options.container).offset();
      const containerWidth = $$(this.options.container).innerWidth();
      const containerHeight = $$(this.options.container).innerHeight();
      const imageWidth = $target.outerWidth();
      const imageHeight = $target.outerHeight();

      this.$popover.css({
        display: 'block',
        visibility: 'hidden',
        left: 0,
        top: 0,
      });

      const popoverWidth = this.$popover.outerWidth();
      const popoverHeight = this.$popover.outerHeight();
      const imageLeft = position.left - containerOffset.left;
      const imageTop = position.top - containerOffset.top;
      const pointerLeft = this.getPointerLeft(event, imageLeft, imageWidth);
      const pointerTop = this.getPointerTop(event, imageTop, imageHeight);

      if (pointerLeft !== null || pointerTop !== null) {
        this.anchorState = {
          target,
          offsetX: pointerLeft !== null ? pointerLeft - imageLeft : imageWidth / 2,
          offsetY: pointerTop !== null ? pointerTop - imageTop : null,
        };
      }

      const anchorLeft = this.anchorState?.target === target
        ? imageLeft + Math.min(Math.max(this.anchorState.offsetX, 0), imageWidth)
        : imageLeft + (imageWidth / 2);
      const anchorTop = this.anchorState?.target === target && typeof this.anchorState.offsetY === 'number'
        ? imageTop + Math.min(Math.max(this.anchorState.offsetY, 0), imageHeight)
        : null;
      const { left, top, placement } = computeImagePopoverPlacement({
        containerWidth,
        containerHeight,
        imageTop,
        imageHeight,
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
