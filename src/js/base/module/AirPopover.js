import $ from 'jquery';
import func from '../core/func';
import lists from '../core/lists';

const AIR_MODE_POPOVER_X_OFFSET = 20;

export default class AirPopover {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.options = context.options;

    this.hidable = true;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.scroll': () => {
        if (this.options.editing) {
          this.update();
        }
      },
      'summernote.disable summernote.change summernote.dialog.shown summernote.blur': () => {
        this.hide();
      },
      'summernote.focusout': (we, e) => {
        if (!this.$popover.is(':active,:focus')) {
          this.hide();
        }
      },
    };
  }

  shouldInitialize() {
    return this.options.airMode && !lists.isEmpty(this.options.popover.air);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-air-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content');

    this.context.invoke('buttons.build', $content, this.options.popover.air);

    // disable hiding this popover preemptively by 'summernote.blur' event.
    this.$popover.on('mousedown', () => { this.hidable = false; });
    // (re-)enable hiding after 'summernote.blur' has been handled (aka. ignored).
    this.$popover.on('mouseup', () => { this.hidable = true; });
  }

  destroy() {
    this.$popover.remove();
  }

  update() {
    const styleInfo = this.context.invoke('editor.currentStyle');
    if (styleInfo.range && !styleInfo.range.isCollapsed()) {
      const rect = lists.last(styleInfo.range.getClientRects());
      if (rect) {
        const bnd = func.rect2bnd(rect);

        this.$popover.css({
          display: 'block',
          left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
          top: bnd.top + bnd.height,
        });
        this.context.invoke('buttons.updateCurrentStyle', this.$popover);
      }
    } else {
      this.hide();
    }
  }

  hide() {
    if (this.hidable) {
      this.$popover.hide();
    }
  }
}
