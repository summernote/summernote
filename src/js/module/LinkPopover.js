import $ from 'jquery';
import lists from '../core/lists';
import dom from '../core/dom';

export default class LinkPopover {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.options = context.options;
    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': () => {
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
    return !lists.isEmpty(this.options.popover.link);
  }

  initialize() {
    this.$popover = this.ui.popover({
      className: 'note-link-popover',
      callback: ($node) => {
        const $content = $node.find('.popover-content,.note-popover-content');
        $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
      },
    }).render().appendTo(this.options.container);
    const $content = this.$popover.find('.popover-content,.note-popover-content');

    this.context.invoke('buttons.build', $content, this.options.popover.link);

    this.$popover.on('mousedown', (e) => { e.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  update() {
    // Prevent focusing on editable when invoke('code') is executed
    if (!this.context.invoke('editor.hasFocus')) {
      this.hide();
      return;
    }

    const rng = this.context.invoke('editor.getLastRange');
    if (rng.isCollapsed() && rng.isOnAnchor()) {
      const anchor = dom.ancestor(rng.sc, dom.isAnchor);
      const href = $(anchor).attr('href');
      this.$popover.find('a').attr('href', href).text(href);

      const pos = dom.posFromPlaceholder(anchor);
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
  }

  hide() {
    this.$popover.hide();
  }
}
