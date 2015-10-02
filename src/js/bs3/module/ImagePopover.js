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
      this.$popover = ui.popover({
        className: 'note-image-popover'
      }).render().appendTo('body');

      context.buildButtons(this.$popover.find('.popover-content'), options.popover.image);
      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      this.$popover.remove();
      dom.detachEvents($note, this.events);
    };

    this.update = function (target) {
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
      this.$popover.hide();
    };
  };

  return ImagePopover;
});
