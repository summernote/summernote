import $ from 'jquery';
import env from '../core/env';
import lists from '../core/lists';
import dom from '../core/dom';

export default class TablePopover {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.mousedown': (we, e) => {
        this.update(e.target);
      },
      'summernote.keyup summernote.scroll summernote.change': () => {
        this.update();
      },
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
    return !lists.isEmpty(this.options.popover.table);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-table-popover',
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');

    this.context.invoke('buttons.build', $content, this.options.popover.table);

    // [workaround] Disable Firefox's default table editor
    if (env.isFF) {
      document.execCommand('enableInlineTableEditing', false, false);
    }

    this.$popover.on('mousedown', (e) => { e.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  update(target) {
    if (this.context.isDisabled()) {
      return false;
    }

    const isCell = dom.isCell(target) || dom.isCell(target?.parentElement);

    if (isCell) {
      const pos = dom.posFromPlaceholder(target);
      const containerOffset = $(this.options.container).offset();
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

    return isCell;
  }

  hide() {
    this.$popover.hide();
  }
}
