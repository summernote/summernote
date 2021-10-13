import $ from 'jquery';
import lists from '../core/lists';
import dom from '../core/dom';

/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */
export default class ImagePopover {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;

    this.editable = context.layoutInfo.editable[0];
    this.options = context.options;

    this.events = {
      'summernote.disable summernote.dialog.shown': () => {
        this.hide();
      },
      'summernote.blur': (we, e) => {
        if (e.originalEvent && e.originalEvent.relatedTarget) {
          if (!this.$popover[0].contains(e.originalEvent.relatedTarget)) {
            this.hide();
          }
        } else {
          this.hide();
        }
      },
    };
  }

  shouldInitialize() {
    return !lists.isEmpty(this.options.popover.image);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-image-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');
    this.context.invoke('buttons.build', $content, this.options.popover.image);

    this.$popover.on('mousedown', (e) => { e.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  update(target, event) {
    if (dom.isImg(target)) {
      const position = $(target).offset();
      const containerOffset = $(this.options.container).offset();
      let pos = {};
      if (this.options.popatmouse) {
        pos.left = event.pageX - 20;
        pos.top = event.pageY;
      } else {
        pos = position;
      }
      pos.top -= containerOffset.top;
      pos.left -= containerOffset.left;

      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top,
      });
    } else {
      this.hide();
    }
  }

  hide() {
    this.$popover.hide();
  }
}
