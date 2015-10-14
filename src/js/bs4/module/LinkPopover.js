define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var LinkPopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var options = context.options;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function () {
        self.update();
      }
    };

    this.initialize = function () {
      this.$popover = ui.popover({
        className: 'note-link-popover',
        callback: function ($node) {
          var $content = $node.find('.popover-content');
          $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
        }
      }).render().appendTo('body');


      context.buildButtons(this.$popover.find('.popover-content'), options.popover.link);

      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      this.$popover.remove();
      dom.detachEvents($note, this.events);
    };

    this.update = function () {
      var rng = context.invoke('editor.createRange');
      if (rng.isCollapsed() && rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        var href = $(anchor).attr('href');
        this.$popover.find('a').attr('href', href).html(href);

        var pos = dom.posFromPlaceholder(anchor);
        this.$popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  return LinkPopover;
});
