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
    }).render();

    $editingArea.append($popover);

    this.initialize = function () {

      summernote.generateButtons($popover.find(".popover-content"), options.popover.image);

      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      }).on('summernote.scroll', function () {
        self.update(summernote.invoke('editor.restoreTarget'));
      });

    };

    this.posFromPlaceholder = function (placeholder) {
      var $placeholder = $(placeholder);
      var pos = $placeholder.position();
      var height = $placeholder.outerHeight(true); // include margin

      // popover below placeholder.
      return {
        left: pos.left,
        top: pos.top + height
      };
    };

    this.update = function (target) {
      if (dom.isImg(target)) {
        var pos = this.posFromPlaceholder(target);
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
