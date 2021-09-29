import $ from 'jquery';
import lists from '../core/lists';

const AIRMODE_POPOVER_X_OFFSET = -5;
const AIRMODE_POPOVER_Y_OFFSET = 5;

export default class AirPopover {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.options = context.options;

    this.hidable = true;
    this.onContextmenu = false;
    this.pageX = null;
    this.pageY = null;

    this.events = {
      'summernote.contextmenu': (e) => {
        if (this.options.editing) {
          e.preventDefault();
          e.stopPropagation();
          this.onContextmenu = true;
          this.update(true);
        }
      },
      'summernote.mousedown': (we, e) => {
        this.pageX = e.pageX;
        this.pageY = e.pageY;
      },
      'summernote.keyup summernote.mouseup summernote.scroll': (we, e) => {
        if (this.options.editing && !this.onContextmenu) {
          this.pageX = e.pageX;
          this.pageY = e.pageY;
          this.update();
        }
        this.onContextmenu = false;
      },
      'summernote.disable summernote.change summernote.dialog.shown summernote.blur': () => {
        this.hide();
      },
      'summernote.focusout': () => {
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

  update(forcelyOpen) {
    const styleInfo = this.context.invoke('editor.currentStyle');
    if (styleInfo.range && (!styleInfo.range.isCollapsed() || forcelyOpen)) {
      let rect = {
        left: this.pageX,
        top: this.pageY,
      };

      const containerOffset = $(this.options.container).offset();
      rect.top -= containerOffset.top;
      rect.left -= containerOffset.left;

      this.$popover.css({
        display: 'block',
        left: Math.max(rect.left, 0) + AIRMODE_POPOVER_X_OFFSET,
        top: rect.top + AIRMODE_POPOVER_Y_OFFSET,
      });
      this.context.invoke('buttons.updateCurrentStyle', this.$popover);
    } else {
      this.hide();
    }
  }

  updateCodeview(isCodeview) {
    this.ui.toggleBtnActive(this.$popover.find('.btn-codeview'), isCodeview);
    if (isCodeview) {
      this.hide();
    } 
  }

  hide() {
    if (this.hidable) {
      this.$popover.hide();
    }
  }
}
