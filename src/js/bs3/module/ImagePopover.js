define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var ImagePopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;
    var options = summernote.options;

    var $popover = ui.popover({
      className: 'note-image-popover'
    }).render().appendTo($popover);

    this.initialize = function () {
      summernote.buildButtons($popover.find('.popover-content'), options.popover.image);

      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      }).on('summernote.scroll', function () {
        self.update(summernote.invoke('editor.restoreTarget'));
      });
    };

    this.update = function (target) {
      if (dom.isImg(target)) {
        var pos = dom.posFromPlaceholder(target);
        $popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });

        summernote.invoke('editor.saveTarget', target);
      } else {
        $popover.hide();
      }
    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return ImagePopover;
});
