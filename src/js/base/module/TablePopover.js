import $ from 'jquery';
import env from '../core/env';
import { Lists } from '../core/lists';
import { BoundaryPoints, Nodes } from '../core/dom';

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
      'summernote.disable': () => {
        this.hide();
      },
    };
  }

  shouldInitialize() {
    return !Lists.isEmpty(this.options.popover.table);
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
  }

  destroy() {
    this.$popover.remove();
  }

  update(target) {
    if (this.context.isDisabled()) {
      return false;
    }

    const isCell = Nodes.isCell(target);

    if (isCell) {
      const pos = BoundaryPoints.posFromPlaceholder(target);
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
