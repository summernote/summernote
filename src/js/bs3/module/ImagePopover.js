define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var ImagePopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var options = context.options;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.change': function () {
        self.update();
      },
      'summernote.scroll': function () {
        self.update();
      }
    };

    this.initialize = function () {
      if (list.isEmpty(options.popover.image)) {
        return;
      }

      this.$popover = ui.popover({
        className: 'note-image-popover'
      }).render().appendTo('body');
      var $content = this.$popover.find('.popover-content');

      context.invoke('buttons.build', $content, options.popover.image);
      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      if (list.isEmpty(options.popover.image)) {
        return;
      }

      this.$popover.remove();
      dom.detachEvents($note, this.events);
    };

    this.update = function (target) {
      if (list.isEmpty(options.popover.image)) {
        return;
      }

      if (dom.isImg(target)) {
        var pos = dom.posFromPlaceholder(target);
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
      if (list.isEmpty(options.popover.image)) {
        return;
      }

      this.$popover.hide();
    };
  };

  return ImagePopover;
});
